import {
  Controller,
  Get,
  Post,
  Req,
  SetMetadata,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
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
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { FileValidationPipe } from "./../../common/pipe/fileValidation.pipe";
import { allowedfileDormats } from "./../../common/pipe/fileValidation.pipe";
import { StorageApproachEnum } from "src/common/enums/multer.enum.js";
import { tmpdir } from "node:os";
import { multerOptions } from "./../../common/utils/multer.confing";

@Controller("user")
export class UserController {
  // constructor(private appService: AppService) {}

  @Auth({})
  @Get()
  getProfile(@User() user: IHUser) {
    return { message: "Done", user: user };
  }

  @Auth({})
  @UsePipes(new FileValidationPipe(allowedfileDormats.img))
  @UseInterceptors(FileInterceptor("ProfilePic", multerOptions()))
  @Post("upload-profile-pic")
  uploadProfilePic(@UploadedFile() file: any) {
    return { message: "Done", file };
  }

  @Auth({})
  @UsePipes(new FileValidationPipe(allowedfileDormats.img))
  @UseInterceptors(FilesInterceptor("coverPic", 4, multerOptions()))
  @Post("upload-cover-pic")
  uploadCoverPic(@UploadedFiles() file: any) {
    return { message: "Done", file };
  }
}
