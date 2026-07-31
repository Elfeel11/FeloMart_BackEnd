import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ZodType } from "zod";

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private _schema: ZodType) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const { success, error, data } = this._schema.safeParse(value);

    if (!success) {
      console.log(
        error.issues.map((ele) => {
          return { path: ele.path, message: ele.message };
        }),
      );

      throw new BadRequestException("Validation Erorr", {
        cause: error.issues.map((ele) => {
          return { path: ele.path, message: ele.message };
        }),
      });
    }

    return data;
  }
}
