import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import type { Options as MulterOptions, FileFilterCallback } from 'multer';
import type { Request } from 'express';

export const multerOptions: MulterOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },

  fileFilter(
    _req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ): void {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, false);
      return;
    }

    callback(null, true);
  },

  storage: diskStorage({
    destination: './uploads/photos',
    filename: (_req, file, callback) => {
      const fileExt = extname(file.originalname);
      const fileName = `${randomUUID()}${fileExt}`;
      callback(null, fileName);
    },
  }),
};
