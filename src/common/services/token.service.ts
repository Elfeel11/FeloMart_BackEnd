import { UserRepo } from "src/Repo/user.repo";
import { RedisService } from "./redis.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { randomUUID } from "crypto";
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { RoleEnum } from "../enums/user.enums.js";
import { IHUser } from "src/models/User.model.js";
import { TokenTypeEnum } from "../enums/token.enum.js";

@Injectable()
export class TokenService {
  private TOKEN_SIGNATURE_USER_ACCESS: string;
  private TOKEN_SIGNATURE_USER_REFRESH: string;
  private TOKEN_SIGNATURE_ADMIN_ACCESS: string;
  private TOKEN_SIGNATURE_ADMIN_REFRESH: string;
  constructor(
    private _redisService: RedisService,
    private _userRepo: UserRepo,
    private _configService: ConfigService,
    private _jwtService: JwtService,
  ) {
    this.TOKEN_SIGNATURE_USER_ACCESS = _configService.get(
      "TOKEN_SIGNATURE_USER_ACCESS",
    ) as string;
    this.TOKEN_SIGNATURE_USER_REFRESH = _configService.get(
      "TOKEN_SIGNATURE_USER_REFRESH",
    ) as string;
    this.TOKEN_SIGNATURE_ADMIN_ACCESS = _configService.get(
      "TOKEN_SIGNATURE_ADMIN_ACCESS",
    ) as string;
    this.TOKEN_SIGNATURE_ADMIN_REFRESH = _configService.get(
      "TOKEN_SIGNATURE_ADMIN_REFRESH",
    ) as string;
  }

  getSignature(role: RoleEnum): {
    accessSignature: string;
    refreshSignature: string;
  } {
    let accessSignature = "";
    let refreshSignature = "";
    switch (role) {
      case RoleEnum.User:
        accessSignature = this.TOKEN_SIGNATURE_USER_ACCESS;
        refreshSignature = this.TOKEN_SIGNATURE_USER_REFRESH;
        break;
      case RoleEnum.Admin:
        accessSignature = this.TOKEN_SIGNATURE_ADMIN_ACCESS;
        refreshSignature = this.TOKEN_SIGNATURE_ADMIN_REFRESH;
        break;
    }

    return { accessSignature, refreshSignature };
  }

  signToken({
    payload = {},
    signature,
    options = {},
  }: {
    payload?: object;
    signature: string;
    options?: SignOptions;
  }) {
    return this._jwtService.sign(payload, { secret: signature, ...options });
  }

  verifyToken({ token, signature }: { token: string; signature: string }) {
    return this._jwtService.verify(token, { secret: signature });
  }

  decodeToken(token: string): JwtPayload {
    return this._jwtService.decode(token);
  }

  generateToken(user: IHUser) {
    const { accessSignature, refreshSignature } = this.getSignature(user.role);

    const tokenId = randomUUID();

    const access_token = this.signToken({
      signature: accessSignature,
      options: {
        subject: user._id.toString(),
        audience: [user.role.toString(), TokenTypeEnum.access],
        expiresIn: 60 * 15,
        jwtid: tokenId,
      },
    });

    const refresh_token = this.signToken({
      signature: refreshSignature,
      options: {
        subject: user._id.toString(),
        audience: [user.role.toString(), TokenTypeEnum.refresh],
        expiresIn: "1y",
        jwtid: tokenId,
      },
    });

    return { access_token, refresh_token };
  }

  async checkToken(token: string, actualTokenType = TokenTypeEnum.access) {
    const decoded = this.decodeToken(token) as JwtPayload;

    const [userRole, tokenType] = decoded.aud as string[];

    if (tokenType != actualTokenType) {
      throw new BadRequestException("invalid token type");
    }

    const { accessSignature, refreshSignature } = this.getSignature(
      Number(userRole),
    );

    const verifiedToken = this.verifyToken({
      token: token,
      signature:
        TokenTypeEnum.refresh == tokenType ? refreshSignature : accessSignature,
    });

    if (
      await this._redisService.get(
        this._redisService.getBlackListTokenKey({
          userId: verifiedToken.sub as string,
          tokenId: verifiedToken.jti as string,
        }),
      )
    ) {
      throw new UnauthorizedException("You need to login again");
    }

    const user = await this._userRepo.findById({
      _id: verifiedToken.sub as string,
    });

    if (!user) {
      throw new UnauthorizedException("Account not found, Signup First!");
    }

    if (verifiedToken.iat! * 1000 < Number(user.changeCreditTime)) {
      throw new UnauthorizedException("You need to login again");
    }

    return { user, verifiedToken };
  }
}
