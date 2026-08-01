import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import slugify from "slugify";
import { Category } from "./Category.model.js";

export interface IBrand {
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
  logo: string;
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
export class Brand implements IBrand {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name!: string;

  @Prop({
    type: String,
    unique: true,
    set: function (this: Brand) {
      const slug = slugify(this.name);
      return slug;
    },
  })
  slug!: string;

  @Prop({
    type: String,
  })
  image!: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive!: boolean;
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  @Prop({
    type: String,
  })
  logo!: string;
}

const categorySechema = SchemaFactory.createForClass(Brand);

export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: categorySechema },
]);
