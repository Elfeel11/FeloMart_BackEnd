import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { compare, hash } from "bcrypt";
import CryptoJS from "crypto-js";

@Injectable()
export class SecurityService {
  private ENCRYPTION_KEY: string;
  private SALT_ROUND: number;

  constructor(private _configService: ConfigService) {
    this.ENCRYPTION_KEY = this._configService.get("ENCRYPTION_kEY") as string;
    this.SALT_ROUND = Number(this._configService.get("SALT_ROUND") as string);
  }

  encryptValue({
    value,
    key = this.ENCRYPTION_KEY,
  }: {
    value: string;
    key?: string;
  }) {
    return CryptoJS.AES.encrypt(value, key).toString();
  }

  decryptValue({
    cipherText,
    key = this.ENCRYPTION_KEY,
  }: {
    cipherText: string;
    key?: string;
  }) {
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  }

  async hashOperation({
    plainText,
    rounds = this.SALT_ROUND,
  }: {
    plainText: string;
    rounds?: number;
  }) {
    return await hash(plainText, rounds);
  }

  async compareOperation({
    plainValue,
    hashedValue,
  }: {
    plainValue: string;
    hashedValue: string;
  }) {
    return await compare(plainValue, hashedValue);
  }
}
