import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Brand, IBrand } from "./../../models/Brand.model";
import slugify from "slugify";

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}
  async createBrand(data: Partial<IBrand>) {
    const isNameExist = await this.brandModel.findOne({ name: data.name });

    if (isNameExist) {
      throw new BadRequestException("name already exist");
    }

    return await this.brandModel.create({
      name: data.name,
      slug: slugify(data.name as string),
    });
  }

  async updateBrand(id: string, data: Partial<IBrand>) {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException("Brand not found");
    }
    if (data.name) {
      const isNameExist = await this.brandModel.findOne({
        name: data.name,
        _id: {
          $ne: id,
        },
      });
      if (isNameExist) {
        throw new BadRequestException("name already exist");
      }
      brand.name = data.name;
      brand.slug = slugify(data.name);
    }
    await brand.save();
    return brand;
  }

  async getAllBrands() {
    return await this.brandModel.find();
  }

  async getBrandById(id: string) {
    const brand = await this.brandModel.findById(id);

    if (!brand) {
      throw new NotFoundException("Brand not found");
    }

    return brand;
  }

  async deleteBrand(id: string) {
    const brand = await this.brandModel.findByIdAndDelete(id);

    if (!brand) {
      throw new NotFoundException("Brand not found");
    }

    return brand;
  }
}
