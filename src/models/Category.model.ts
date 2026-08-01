import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import slugify from "slugify";

export interface ICategory {
  name: string;
  slug: string;
  image: string;
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
export class Category implements ICategory {
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
    set: function (this: Category) {
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
}

const categorySechema = SchemaFactory.createForClass(Category);

export const categoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: categorySechema },
]);
