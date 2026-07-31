import {
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  SignUpDto,
  LogInDto,
  ResendConfirmEmailDto,
  ConfirmEmailDto,
  signupWithGmailDto,
} from "./dto/authentcation.dto.js";
import type { Response } from "express";

UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

@Controller("auth")
export class AuthController {
  constructor(private _AuthService: AuthService) {}

  @Post("signup")
  async signUp(@Body() body: SignUpDto) {
    const result = await this._AuthService.signup(body);
    return result;
  }

  @Post("login")
  async lognUp(@Body() body: LogInDto) {
    const result = await this._AuthService.login(body);
    return result;
  }

  @Post("confirm-email")
  async confirmEmail(@Body() body: ConfirmEmailDto) {
    const result = await this._AuthService.confirmEmail(body);
    return result;
  }

  @Post("resend-confirm-email-otp")
  async resendConfirmEmail(@Body() body: ResendConfirmEmailDto) {
    const result = await this._AuthService.resendOTP(body.email);
    return result;
  }

  @Post("signup/gmail")
  async signupWithGmail(
    @Body() body: signupWithGmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this._AuthService.signupWithGmail(body.idToken);
    res.status(result.status);
    return result;
  }
}
