import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { SubCategoryService } from "./subCategory.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ISubCategory } from "src/models/SubCategory.model.js";

@Controller("sub-category")
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  createSubCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Partial<ISubCategory>,
  ) {
    return this.subCategoryService.createSubCategory(body);
  }

  @Patch("/:id")
  @UseInterceptors(FileInterceptor("image"))
  async updateSubCategory(
    @UploadedFile() file: Express.Multer.File,
    @Param("id") id: string,
    @Body() body: Partial<ISubCategory>,
  ) {
    return this.subCategoryService.updateSubCategory(id, body);
  }
}
