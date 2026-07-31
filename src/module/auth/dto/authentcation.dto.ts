import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Matches,
  matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { isMatch as IsMatch } from "src/common/validation/match.validation";

export class LogInDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsMatch(["email"])
  ConfirmEmail!: string;

  @IsStrongPassword()
  password!: string;

  @IsOptional()
  @IsString()
  FCM!: string;
}

export class SignUpDto extends LogInDto {
  @MaxLength(20)
  @MinLength(3)
  @IsString()
  userName!: string;

  @ValidateIf((obj) => {
    return obj.password;
  })
  @IsMatch(["password"])
  confirmPassword!: string;

  @IsOptional()
  @IsEnum(["Male", "Female"], { message: " Gender must be Male or Female" })
  gender!: string;

  @IsPhoneNumber()
  phone!: string;
}

export class ResendConfirmEmailDto {
  @IsEmail()
  email!: string;
}

export class ConfirmEmailDto extends ResendConfirmEmailDto {
  @Matches(/\d{6}/)
  otp!: string;
}

export class signupWithGmailDto {
  @IsString()
  idToken!: string;
}
