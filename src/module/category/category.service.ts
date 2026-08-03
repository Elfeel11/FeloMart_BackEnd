import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category, ICategory } from "src/models/Category.model";
import { Model, Types } from "mongoose";
import slugify from "slugify";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async creatCategory(data: Partial<ICategory>) {
    const isNameExist = await this.categoryModel.findOne({ name: data.name });

    if (isNameExist) {
      throw new BadRequestException("name already exist");
    }

    return await this.categoryModel.create({
      name: data.name,
      slug: slugify(data.name as string),
    });
  }

  async getAllCategory() {
    const categories = await this.categoryModel.find();

    return {
      statusCode: 200,
      message: "success",
      data: categories.map((category) => this.categoryModel.find(category)),
    };
  }

  async updateCategory(id: string, data: Partial<ICategory>) {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    if (data.name) {
      const isNameExist = await this.categoryModel.findOne({
        name: data.name,
        _id: {
          $ne: id,
        },
      });
      if (isNameExist) {
        throw new BadRequestException("name already exist");
      }
      category.name = data.name;
      category.slug = slugify(data.name);
    }
    await category.save();
    return category;
  }

  async deleteCategory(id: Types.ObjectId) {
    const Category = await this.categoryModel.findByIdAndDelete(id);

    if (!Category) {
      throw new NotFoundException("Category not found");
    }

    return Category;
  }
}
