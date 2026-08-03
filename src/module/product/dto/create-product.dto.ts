import { Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { DiscountEnum } from "src/common/enums/product.enum.js";

export class DiscountDto {
  @IsNumber()
  @Min(0)
  amount!: number;

  @IsEnum(DiscountEnum)
  type!: DiscountEnum;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DiscountDto)
  discount?: DiscountDto;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  subCategory!: string;

  @IsString()
  @IsNotEmpty()
  brand!: string;
}
