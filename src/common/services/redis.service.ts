import type { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import type { RedisClientType } from "redis";
import { EmailTypeEnum } from "../enums/mail.enum.js";

@Injectable()
export class RedisService {
  constructor(@Inject("Redis_Client") private _client: RedisClientType) {}

  getBlackListTokenKey({
    userId,
    tokenId,
  }: {
    userId: string | Types.ObjectId;
    tokenId: string;
  }) {
    return `blackListToken::${userId}::${tokenId}`;
  }

  getOTPKey({ email, emailType }: { email: string; emailType: EmailTypeEnum }) {
    return `OTP::${email}::${emailType}`;
  }

  getOTPReqNoKey({
    email,
    emailType,
  }: {
    email: string;
    emailType: EmailTypeEnum;
  }) {
    return `OTP::${email}::${emailType}::No`;
  }

  getOTPBlockedKey({
    email,
    emailType,
  }: {
    email: string;
    emailType: EmailTypeEnum;
  }) {
    return `OTP::${email}::${emailType}::Blocked`;
  }

  getFCMTokenKey(userId: string | Types.ObjectId) {
    return `FCMToken::${userId}`;
  }

  getSocketKey(userId: string | Types.ObjectId) {
    return `socketIds::${userId}`;
  }
  async set({
    key,
    value,
    exType = "EX",
    exValue = 50,
  }: {
    key: string;
    value: string | number;
    exType?: "EX" | "PX" | "EXAT" | "PXAT";
    exValue?: number;
  }) {
    return await this._client.set(key, value, {
      expiration: { type: exType, value: Math.floor(exValue) },
    });
  }

  async incr(key: string) {
    return await this._client.incr(key);
  }

  async decr(key: string) {
    return await this._client.decr(key);
  }

  async update({ key, value }: { key: string; value: string | number }) {
    const fieldExists = await this._client.exists(key);
    if (!fieldExists) {
      return 0;
    }

    return await this._client.set(key, value);
  }

  async remove(keys: string | string[]) {
    return await this._client.del(keys);
  }

  async ttl(key: string) {
    return await this._client.ttl(key);
  }

  async setExpire(key: string, seconds: number) {
    return await this._client.expire(key, seconds);
  }

  async removeExpire(key: string) {
    return await this._client.persist(key);
  }

  async get(key: string) {
    return await this._client.get(key);
  }

  async mget(key: string[]) {
    return await this._client.mGet(key);
  }

  async exists(key: string) {
    return await this._client.exists(key);
  }

  async addBrowserTokenToSet(userId: string | Types.ObjectId, token: string) {
    return await this._client.sAdd(this.getFCMTokenKey(userId), token);
  }

  async getUserBrowserTokens(userId: string | Types.ObjectId) {
    return await this._client.sMembers(this.getFCMTokenKey(userId));
  }

  async addSocketIdToSet(userId: string | Types.ObjectId, socketId: string) {
    return await this._client.sAdd(this.getSocketKey(userId), socketId);
  }

  async getUserSocketIds(userId: string | Types.ObjectId) {
    return await this._client.sMembers(this.getSocketKey(userId));
  }

  async removeUserSocketId(userId: string | Types.ObjectId, socketId: string) {
    return await this._client.sRem(this.getSocketKey(userId), socketId);
  }
}
