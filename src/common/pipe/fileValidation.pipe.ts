import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
export const allowedfileDormats = {
  img: ["image/png", "image/jpg"],
  video: ["vedio/mp4"],
  pdf: ["application/pdf"],
};

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private allowedFormats: string[]) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.allowedFormats.includes(value.mimetype)) {
      throw new BadRequestException("invalid file type");
    }

    return true;
  }
}
