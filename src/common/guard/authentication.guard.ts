import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TokenService } from "../services/token.service";
import { IRequestAuth } from "../interface/request.interface";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _tokenService: TokenService,
    private _reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let authorization!: string;
    let req!: IRequestAuth;

    switch (context.getType()) {
      case "http":
        req = context.switchToHttp().getRequest();
        authorization = req.headers.authorization as string;
        break;
      default:
        break;
    }

    if (!authorization) {
      throw new BadRequestException("you need to login first");
    }

    const [bearerKey, token] = authorization.split(" ");

    if (bearerKey != "Bearer") {
      throw new BadRequestException("invalid bearer key");
    }

    if (!token) {
      throw new BadRequestException("invalid token");
    }

    const tokenType = this._reflector.getAllAndOverride("tokenType", [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user, verifiedToken } = await this._tokenService.checkToken(
      token,
      tokenType,
    );

    req.user = user;
    req.tokenPayload = verifiedToken;

    console.log(context.getType());

    return true;
  }
}
