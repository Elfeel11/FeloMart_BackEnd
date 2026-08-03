import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "src/models/Category.model";
import { Model } from "mongoose";
import { SubCategory } from "./../../models/SubCategory.model";
import slugify from "slugify";
import { ISubCategory } from "./../../models/SubCategory.model";

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}
  async createSubCategory(data: Partial<ISubCategory>) {
    const category = await this.categoryModel.findById(data.categoryId);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    const isNameExist = await this.subCategoryModel.findOne({
      name: data.name,
    });

    if (isNameExist) {
      throw new BadRequestException("name already exist");
    }

    return await this.subCategoryModel.create({
      name: data.name,
      slug: slugify(data.name as string),
      categoryId: data.categoryId,
    });
  }

  async updateSubCategory(id: string, data: Partial<ISubCategory>) {
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) {
      throw new NotFoundException("SubCategory not found");
    }

    if (data.categoryId) {
      const category = await this.categoryModel.findById(data.categoryId);
      if (!category) {
        throw new NotFoundException("Category not found");
      }
      subCategory.categoryId = data.categoryId;
    }

    if (data.name) {
      const isNameExist = await this.subCategoryModel.findOne({
        name: data.name,
        _id: { $ne: id },
      });
      if (isNameExist) {
        throw new BadRequestException("name already exist");
      }
      subCategory.name = data.name;
      subCategory.slug = slugify(data.name);
    }

    await subCategory.save();
    return subCategory;
  }

  async getAllSubCategories(query?: { category?: string }) {
    const filter: Record<string, any> = {};
    if (query?.category) {
      filter.category = query.category;
    }
    return await this.subCategoryModel.find(filter).populate("category");
  }

  async getSubCategoryById(id: string) {
    const subCategory = await this.subCategoryModel
      .findById(id)
      .populate("category");

    if (!subCategory) {
      throw new NotFoundException("SubCategory not found");
    }

    return subCategory;
  }

  async deleteSubCategory(id: string) {
    const subCategory = await this.subCategoryModel.findByIdAndDelete(id);

    if (!subCategory) {
      throw new NotFoundException("SubCategory not found");
    }

    return subCategory;
  }
}
