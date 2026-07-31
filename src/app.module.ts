import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./module/auth/auth.module.js";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "./module/user/user.module";
import { SharedModule } from "./common/module/shared.Module";

@Module({
  imports: [
    SharedModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [".env.dev", ".env.prod"],
      isGlobal: true,
    }),
    JwtModule.register({ global: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("DB_URI"),
        onConnectionCreate: (connection: Connection) => {
          connection.on("connected", () => console.log("DB connected"));
          connection.on("open", () => console.log("DB open"));
          connection.on("disconnected", () => console.log("DB disconnected"));
          connection.on("reconnected", () => console.log("DB reconnected"));
          connection.on("disconnecting", () => console.log("DB disconnecting"));

          return connection;
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
