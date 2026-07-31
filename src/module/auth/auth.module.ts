import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import userModel from "src/models/User.model";
import { UserRepo } from "src/Repo/user.repo";
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";
import { RedisService } from "./../../common/services/redis.service";
import { EmailService } from "./../../common/services/email.service";
import { TokenService } from "./../../common/services/token.service";
import { SecurityService } from "./../../common/module/security/security.service";
import { JwtService } from "@nestjs/jwt";
import { SharedModule } from "./../../common/module/shared.Module";
import { LoggerMiddleware } from "./../../common/middleware/logger.middleware";

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, EmailService, SecurityService, ConfigService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("auth");
  }
}
