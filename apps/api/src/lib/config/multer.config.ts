// src/lib/config/multer.config.ts
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

const multerOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './uploads';
      
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      cb(null, `temp_${timestamp}_${randomSuffix}.pdf`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 10,
  },
};

export default multerOptions;
