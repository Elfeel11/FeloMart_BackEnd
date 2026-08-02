import { Module } from "@nestjs/common";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { categoryModel } from "./../../models/Category.model";

@Module({
  imports: [categoryModel],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
