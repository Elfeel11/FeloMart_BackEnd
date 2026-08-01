import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRepo } from "src/Repo/user.repo";
import { AuthModule } from "../auth/auth.module";
import userModel from "src/models/User.model";
import { UserController } from "./user.controller";
import { SharedModule } from "./../../common/module/shared.Module";
import { categoryModel } from "src/models/Category.model";

@Module({
  imports: [userModel, categoryModel],
  controllers: [UserController],
  providers: [UserService, UserRepo],
  exports: [UserService],
})
export class UserModule {}
