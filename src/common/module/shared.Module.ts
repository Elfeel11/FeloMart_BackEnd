import { Global, Module } from "@nestjs/common";
import userModel from "src/models/User.model";
import { UserRepo } from "src/Repo/user.repo";
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";
import { RedisService } from "./../../common/services/redis.service";
import { EmailService } from "./../../common/services/email.service";
import { TokenService } from "./../../common/services/token.service";
import { SecurityService } from "./../../common/module/security/security.service";
import { JwtService } from "@nestjs/jwt";
import { SecurityModule } from "./security/security.module";

@Global()
@Module({
  imports: [SecurityModule, userModel],
  providers: [
    UserRepo,

    {
      provide: "Redis_Client",
      inject: [ConfigService],
      useFactory: async (confingService: ConfigService) => {
        const client = createClient({
          url: confingService.get("REDIS_URL"),
        });
        await client.connect();
        console.log("Redis Connected");

        client.on("error", (err) => {
          console.log("Redis error");
          console.log(err);
        });

        return client;
      },
    },
    RedisService,
    UserRepo,
    JwtService,
    TokenService,
    SecurityService,
    ConfigService,
  ],
  exports: [RedisService, TokenService, UserRepo, JwtService],
})
export class SharedModule {}
