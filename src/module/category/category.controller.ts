import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ICategory } from "src/models/Category.model.js";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  createCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Partial<ICategory>,
  ) {
    return this.categoryService.creatCategory(body);
  }

  @Patch("/:id")
  @UseInterceptors(FileInterceptor("image"))
  async updateCategory(
    @UploadedFile() file: Express.Multer.File,
    @Param("id") id: string,
    @Body() body: Partial<ICategory>,
  ) {
    return this.categoryService.updateCategory(id, body);
  }
}
