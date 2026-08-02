import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { BrandService } from "./brand.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { IBrand } from "./../../models/Brand.model";

@Controller("brand")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  createBrand(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Partial<IBrand>,
  ) {
    return this.brandService.createBrand(body);
  }

  @Patch("/:id")
  @UseInterceptors(FileInterceptor("image"))
  async updateBrand(
    @UploadedFile() file: Express.Multer.File,
    @Param("id") id: string,
    @Body() body: Partial<IBrand>,
  ) {
    return this.brandService.updateBrand(id, body);
  }
}
