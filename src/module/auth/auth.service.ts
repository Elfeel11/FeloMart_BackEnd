import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { IHUser, User } from "src/models/User.model";
import { RedisService } from "./../../common/services/redis.service";
import { EmailService } from "./../../common/services/email.service";
import { TokenService } from "./../../common/services/token.service";
import { SecurityService } from "./../../common/module/security/security.service";
import { UserRepo } from "./../../Repo/user.repo";
import { ConfigService } from "@nestjs/config";
import { SignUpDto, LogInDto } from "./dto/authentcation.dto.js";
import { EmailTypeEnum } from "./../../common/enums/mail.enum";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { ProviderEnum } from "src/common/enums/user.enums";

@Injectable()
export class AuthService {
  constructor(
    private _emailService: EmailService,
    private _redisService: RedisService,
    private _tokenService: TokenService,
    private _securityService: SecurityService,
    private _userRepo: UserRepo,
    private _configService: ConfigService,
  ) {}

  async sendEmailOtp({
    email,
    emailType,
    subject,
  }: {
    email: string;
    emailType: EmailTypeEnum;
    subject: string;
  }) {
    const pervOtpTTL = await this._redisService.ttl(
      this._redisService.getOTPKey({ email, emailType }),
    );

    if (pervOtpTTL > 0) {
      throw new BadRequestException(
        `There is already OTP valid for ${pervOtpTTL} seconds`,
      );
    }

    const isBlocked = await this._redisService.exists(
      this._redisService.getOTPBlockedKey({
        email,
        emailType,
      }),
    );

    if (isBlocked) {
      throw new BadRequestException(`Try again later`);
    }

    const reqNo = await this._redisService.get(
      this._redisService.getOTPReqNoKey({
        email,
        emailType,
      }),
    );

    if (Number(reqNo) == 5) {
      await this._redisService.set({
        key: this._redisService.getOTPBlockedKey({
          email,
          emailType,
        }),
        value: 1,
        exValue: 10 * 60,
      });

      throw new BadRequestException(
        `You cannot request more than 5 emails in 20m`,
      );
    }

    const otp = this._emailService.generateOTP();

    await this._emailService.sendMail({
      to: email,
      subject,
      html: `<h1> Your OTP ${otp} </h1>`,
    });

    await this._redisService.set({
      key: this._redisService.getOTPKey({
        email,
        emailType,
      }),
      value: await this._securityService.hashOperation({
        plainText: otp.toString(),
      }),
      exValue: 120,
    });

    await this._redisService.incr(
      this._redisService.getOTPReqNoKey({
        email,
        emailType,
      }),
    );
  }

  async signup(bodyData: SignUpDto): Promise<IHUser> {
    const isEmail = await this._userRepo.findOne({
      filter: { email: bodyData.email },
    });

    if (isEmail) {
      throw new ConflictException("email already exists");
    }

    const [user] = await this._userRepo.create({ data: [bodyData] });

    return user!;
  }

  async login(body: LogInDto) {
    const { email, password } = body;
    const user = await this._userRepo.findOne({
      filter: { email },
    });

    if (!user) {
      throw new UnauthorizedException("invalid info");
    }

    // if (!user.confirmEmail) {
    //   throw new BadRequestException("You need to confirm your email first");
    // }

    const isPasswordValid = await this._securityService.compareOperation({
      plainValue: password,
      hashedValue: user.password,
    });

    if (!isPasswordValid) {
      throw new UnauthorizedException("invalid info");
    }

    // if (bodyData.FCMToken) {
    //   await this._redisService.addBrowserTokenToSet(
    //     user._id,
    //     bodyData.FCMToken,
    //   );
    // }

    // const fcmTokens = await this._redisService.getUserBrowserTokens(user._id);

    // if (fcmTokens.length) {
    //   await notificationService.sendNotifications({
    //     tokens: fcmTokens,
    //     data: {
    //       title: 'new browser logged',
    //       body: `logged in at ${new Date()}`,
    //     },
    //   });
    // }

    return this._tokenService.generateToken(user);
  }

  async confirmEmail(bodyData: any) {
    const { email, otp } = bodyData;

    const user = await this._userRepo.findOne({
      filter: { email, confirmEmail: false },
    });

    if (!user) {
      throw new BadRequestException("Invalid email or email already confirmed");
    }

    const storedOtp = await this._redisService.get(
      this._redisService.getOTPKey({
        email,
        emailType: EmailTypeEnum.confirmEmail,
      }),
    );

    if (!storedOtp) {
      throw new BadRequestException("OTP Expired");
    }

    const isOtpValid = await this._securityService.compareOperation({
      plainValue: otp,
      hashedValue: storedOtp,
    });

    if (!isOtpValid) {
      throw new BadRequestException("OTP Not Valid");
    }

    user.confirmEmail = true;
    await user.save();
  }

  async resendOTP(email: string) {
    await this.sendEmailOtp({
      email,
      emailType: EmailTypeEnum.confirmEmail,
      subject: "Another OTP to confirm your email",
    });
    return;
  }

  async resendForgetPasswordOTP(email: string) {
    await this.sendEmailOtp({
      email,
      emailType: EmailTypeEnum.forgetPassword,
      subject: "Another OTP To Reset Your password",
    });
  }

  async sendOTPForgetPassword(email: string) {
    const user = await this._userRepo.findOne({ filter: { email } });

    if (!user) {
      return;
    }

    if (!user.confirmEmail) {
      throw new BadRequestException("Confirm your email first");
    }

    await this.sendEmailOtp({
      email,
      emailType: EmailTypeEnum.forgetPassword,
      subject: "Reset Your Password",
    });
  }

  async verifyOTPForgetPassword(bodyData: any) {
    const { email, otp } = bodyData;

    const emailOTP = await this._redisService.get(
      this._redisService.getOTPKey({
        email,
        emailType: EmailTypeEnum.forgetPassword,
      }),
    );

    if (!emailOTP) {
      throw new BadRequestException("OTP Expired");
    }

    const isOtpValid = await this._securityService.compareOperation({
      plainValue: otp,
      hashedValue: emailOTP,
    });

    if (!isOtpValid) {
      throw new BadRequestException("OTP Not Valid");
    }
  }

  async resetPassword(bodyData: any) {
    const { email, password, otp } = bodyData;

    await this.verifyOTPForgetPassword({ email, otp });

    await this._userRepo.updateOne({
      filter: { email },
      update: {
        password: await this._securityService.hashOperation({
          plainText: password,
        }),
      },
    });

    return;
  }

  async verifyGoogleToken(idToken: string) {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken,
      audience: this._configService.get<string>("GOOGLE_CLIENT_ID"),
    });

    const payload = ticket.getPayload();

    return payload as TokenPayload;
  }

  async loginWithGoogle(idToken: string) {
    const payload = await this.verifyGoogleToken(idToken);

    if (!payload) {
      throw new BadRequestException("invalid token payload");
    }

    if (!payload.email_verified) {
      throw new BadRequestException("Email must be verified");
    }

    const user = await this._userRepo.findOne({
      filter: { email: payload.email as string, provider: ProviderEnum.Google },
    });

    // if (!user) {
    //   return signupWithGmail(idToken);
    // }

    return this._tokenService.generateToken(user as IHUser);
  }

  async signupWithGmail(idToken: string) {
    const payloadGoogleToken = await this.verifyGoogleToken(idToken);

    if (!payloadGoogleToken.email_verified) {
      throw new BadRequestException("Email must be verified");
    }

    const user = await this._userRepo.findOne({
      filter: { email: payloadGoogleToken.email as string },
    });

    if (user) {
      if (user.provider == ProviderEnum.System) {
        throw new BadRequestException(
          "Account already exists, login with your email and password",
        );
      }
      return { status: 200, result: await this.loginWithGoogle(idToken) }; // loginWithGoogle
    }

    const [newUser] = await this._userRepo.create({
      data: [
        {
          email: payloadGoogleToken.email,
          userName: payloadGoogleToken.name,
          profilePic: payloadGoogleToken.picture,
          confirmEmail: true,
          provider: ProviderEnum.Google,
        },
      ],
    });

    return {
      status: 201,
      result: this._tokenService.generateToken(newUser as IHUser),
    };
  }
}
