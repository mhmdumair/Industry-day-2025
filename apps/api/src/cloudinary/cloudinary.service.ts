import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, DeleteApiResponse, v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { 
          folder: folderName,
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1000, crop: "limit" }
          ]
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );
      
      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadProfilePicture(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    const result = await this.uploadFile(file, 'profile_pictures');
    return result as UploadApiResponse;
  }

  async uploadCompanyLogo(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    const result = await this.uploadFile(file, 'company_logos');
    return result as UploadApiResponse;
  }
  
  async deleteFile(publicId: string): Promise<DeleteApiResponse> {
    return cloudinary.uploader.destroy(publicId);
  }
}