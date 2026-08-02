import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import slugify from "slugify";
import { DiscountEnum } from "src/common/enums/product.enum.js";
import { ObjectId, Types } from "mongoose";
import { Brand } from "./Brand.model.js";
import { Category } from "./Category.model.js";
import { SubCategory } from "./SubCategory.model.js";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  priceAfterDiscount: number;
  discount: {
    discount: number;
    type: DiscountEnum;
  };
  stock: number;
  galary: string[];
  category: Types.ObjectId;
  subCategory: Types.ObjectId;
  brand: Types.ObjectId;
  rating: {
    avg: number;
    count: number;
  };
  isActive: boolean;
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  strictQuery: true,
})
export class Product implements IProduct {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    set: function (this: Product) {
      const slug = slugify(this.name);
      return slug;
    },
  })
  slug!: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Brand.name,
  })
  brand!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: Category.name,
  })
  category!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: SubCategory.name,
  })
  subCategory!: Types.ObjectId;
  @Prop({
    type: Number,
    default: 0,
  })
  stock!: number;

  @Prop({
    type: String,
    required: true,
  })
  description!: string;

  @Prop({
    type: {
      discount: Number,
      type: {
        type: Number,
        enum: DiscountEnum,
      },
    },
  })
  discount!: { discount: number; type: DiscountEnum };

  @Prop({
    type: [String],
  })
  galary!: string[];

  @Prop({
    type: Number,
    required: true,
  })
  price!: number;

  @Prop({
    type: Number,
  })
  priceAfterDiscount!: number;

  @Prop({
    type: {
      avg: Number,
      count: Number,
    },
  })
  rating!: { avg: number; count: number };
  @Prop({
    type: Boolean,
    default: true,
  })
  isActive!: boolean;
}

const ProductSechema = SchemaFactory.createForClass(Product);

export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSechema },
]);
