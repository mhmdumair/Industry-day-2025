// src/cv/cv.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch,
  Param, 
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
  InternalServerErrorException, 
  NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { createReadStream } from 'fs';
import * as fs from 'fs';
import { CvService } from './cv.service';
import multerOptions from '../lib/config/multer.config';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('pdf', multerOptions))
  async uploadCV(
    @UploadedFile() file: Express.Multer.File,
    @Body('studentID') studentID: string
  ) {
    if (!file) {
      throw new BadRequestException('No PDF file provided');
    }

    if (!studentID) {
      throw new BadRequestException('Student ID is required');
    }

    const cleanStudentID = studentID.replace(/['"]/g, '');
    
    try {
      const result = await this.cvService.uploadCV(file, cleanStudentID);
      return result;
    } catch (error) {
      if (file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup temp file:', cleanupError);
        }
      }
      throw error;
    }
  }

  @Get(':cvId')
  async getCvFile(@Param('cvId') cvId: string, @Res() res: Response) {
    try {
      const cv = await this.cvService.getCvFileInfoById(cvId);
      const stats = fs.statSync(cv.filePath);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': stats.size.toString(),
        'Content-Disposition': `inline; filename="${cv.fileName}"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      const fileStream = createReadStream(cv.filePath);
      
      fileStream.on('error', (error) => {
        console.error('File stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error reading CV file' });
        }
      });

      fileStream.pipe(res);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error serving CV file:', error);
      throw new InternalServerErrorException('Failed to serve CV file');
    }
  }

  @Get('student/:studentId')
  async getCvByStudentId(@Param('studentId') studentId: string, @Res() res: Response) {
    try {
      const cv = await this.cvService.getCvFileInfoByStudentId(studentId);
      const stats = fs.statSync(cv.filePath);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': stats.size.toString(),
        'Content-Disposition': `inline; filename="${cv.fileName}"`,
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      const fileStream = createReadStream(cv.filePath);
      
      fileStream.on('error', (error) => {
        console.error('File stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error reading CV file' });
        }
      });

      fileStream.pipe(res);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error serving CV file by student ID:', error);
      throw new InternalServerErrorException('Failed to serve CV file');
    }
  }

  @Get(':cvId/info')
  async getCvInfo(@Param('cvId') cvId: string) {
    return this.cvService.findByCvId(cvId);
  }

  @Get('student/:studentId/list')
  async getStudentCvList(@Param('studentId') studentId: string) {
    return this.cvService.getStudentCvList(studentId);
  }

  @Get(':cvId/download')
  async downloadCV(@Param('cvId') cvId: string, @Res() res: Response) {
    try {
      const cvData = await this.cvService.downloadCV(cvId);
      const fileStream = createReadStream(cvData.filePath);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cvData.fileName}"`,
      });

      fileStream.on('error', (error) => {
        console.error('Download stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error downloading CV file' });
        }
      });

      fileStream.pipe(res);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':cvId')
  async update(
    @Param('cvId') cvId: string, 
    @Body('fileName') fileName?: string
  ) {
    return this.cvService.update(cvId, fileName);
  }

  @Delete(':cvId')
  async remove(@Param('cvId') cvId: string) {
    await this.cvService.remove(cvId);
    return { message: 'CV deleted successfully' };
  }
}
