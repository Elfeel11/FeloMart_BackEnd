import {
  Controller,
  Get,
  Post,
  Req,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import type { Express } from "express";
import type { IRequestAuth } from "src/common/interface/request.interface.js";
import { AuthGuard } from "./../../common/guard/authentication.guard";
import { TokenTypeEnum } from "src/common/enums/token.enum";
import { RoleEnum } from "src/common/enums/user.enums";
import { Authoriaztionuard } from "./../../common/guard/authorization.guard";
import { Auth } from "./../../common/decorator/aurh.decorator";
import { User } from "./../../common/decorator/user.decorator";
import type { IHUser } from "src/models/User.model";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";

@Controller("user")
export class UserController {
  // constructor(private appService: AppService) {}

  @Auth({})
  @Get()
  getProfile(@User() user: IHUser) {
    return { message: "Done", user: user };
  }

  @UseInterceptors(
    FileInterceptor("ProfilePic", {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Post("upload-profile-pic")
  getProfilePic(@UploadedFile() file: any) {
    return { message: "Done", user: file };
  }
}
