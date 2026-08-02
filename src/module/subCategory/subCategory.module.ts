import { Module } from "@nestjs/common";
import { SubCategoryController } from "./subCategory.controller";
import { SubCategoryService } from "./subCategory.service";
import { subCategoryModel } from "./../../models/SubCategory.model";
import { categoryModel } from "./../../models/Category.model";

@Module({
  imports: [subCategoryModel, categoryModel],
  providers: [SubCategoryService],
  controllers: [SubCategoryController],
})
export class SubCategoryModule {}
