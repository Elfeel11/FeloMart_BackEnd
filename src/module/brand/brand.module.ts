import { Module } from "@nestjs/common";
import { BrandService } from "./brand.service";
import { BrandController } from "./brand.controller";
import { BrandModel } from "./../../models/Brand.model";

@Module({
  imports: [BrandModel],
  providers: [BrandService],
  controllers: [BrandController],
})
export class BrandModule {}
