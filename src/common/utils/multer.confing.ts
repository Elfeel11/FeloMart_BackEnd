import multer from "multer";
import { StorageApproachEnum } from "../enums/multer.enum.js";
import { tmpdir } from "node:os";
import { allowedfileDormats } from "../pipe/fileValidation.pipe.js";
import { randomUUID } from "crypto";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface.js";

export function multerOptions({
  storageApproach = StorageApproachEnum.Memory,
  allowedFormat = allowedfileDormats.img,
  fileSize = 5,
}: {
  storageApproach?: StorageApproachEnum;
  allowedFormat?: string[];
  fileSize?: number;
} = {}): MulterOptions {
  const storage =
    storageApproach == StorageApproachEnum.Memory
      ? multer.memoryStorage()
      : multer.diskStorage({
          destination(req, file, callback) {
            callback(null, tmpdir());
          },
          filename(req, file, callback) {
            callback(null, `${randomUUID()}_${file.originalname}`);
          },
        });
  return {
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
  };
}
