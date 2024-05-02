import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class FileUploadService {
  private s3Client: S3Client;
  private s3Region: string;

  constructor(private configService: ConfigService) {
    this.s3Region = this.configService.getOrThrow('S3_REGION');
    this.s3Client = new S3Client({
      region: this.s3Region,
    });
  }

  async uploadImageToS3(file: Express.Multer.File, filename: string) {
    const bucket = this.configService.get<string>('S3_BUCKET');

    try {
      const response: PutObjectCommandOutput = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: filename,
          Body: file.buffer,
        }),
      );

      if (response.$metadata.httpStatusCode === 200) {
        return `https://${bucket}.s3.${this.s3Region}.amazonaws.com/${filename}`;
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  async uploadImage(file: Express.Multer.File) {
    const filename = this.generateFileName(file.originalname);
    const imageUrl = await this.uploadImageToS3(file, filename);

    return imageUrl;
  }

  generateFileName(filename: string) {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);

    const fileExtension = filename.split('.').pop();
    const uniqueFileName = `${timestamp}-${randomString}.${fileExtension}`;

    return uniqueFileName;
  }
}
