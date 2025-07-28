// src/cv/cv.service.ts
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCv } from '../typeorm/entities';
import { Student } from '../typeorm/entities';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CvService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(StudentCv)
    private cvRepository: Repository<StudentCv>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async uploadCV(file: Express.Multer.File, studentID: string): Promise<StudentCv> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      if (!studentID || studentID.trim() === '') {
        throw new BadRequestException('Student ID is required');
      }

      const student = await this.studentRepository.findOne({
        where: { studentID: studentID.trim() }
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentID} does not exist`);
      }

      if (!student.regNo || student.regNo.trim() === '') {
        throw new BadRequestException(`Student ${studentID} does not have a valid registration number`);
      }

      if (!fs.existsSync(this.uploadsDir)) {
        fs.mkdirSync(this.uploadsDir, { recursive: true });
      }

      const sanitizedRegNo = student.regNo.replace(/[^a-zA-Z0-9]/g, '');
      const newFileName = `${sanitizedRegNo}.pdf`;
      const newFilePath = path.join(this.uploadsDir, newFileName);

      if (!fs.existsSync(file.path)) {
        throw new BadRequestException('Uploaded file not found on server');
      }

      const existingCV = await this.cvRepository.findOne({
        where: { studentID: studentID }
      });

      if (existingCV && existingCV.filePath && fs.existsSync(existingCV.filePath)) {
        fs.unlinkSync(existingCV.filePath);
      }

      fs.renameSync(file.path, newFilePath);

      if (!fs.existsSync(newFilePath)) {
        throw new InternalServerErrorException('Failed to save file to final location');
      }

      let savedCV: StudentCv;

      if (existingCV) {
        existingCV.fileName = newFileName;
        existingCV.filePath = newFilePath;
        savedCV = await this.cvRepository.save(existingCV);
      } else {
        const cv = new StudentCv();
        cv.studentID = studentID;
        cv.fileName = newFileName;
        cv.filePath = newFilePath;
        savedCV = await this.cvRepository.save(cv);
      }

      return savedCV;
    } catch (error) {
      if (file && file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup temporary file:', cleanupError);
        }
      }

      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }

      console.error('Unexpected error in uploadCV:', error);
      throw new InternalServerErrorException('An unexpected error occurred during file upload');
    }
  }

  async getCvFileInfoById(cvId: string): Promise<StudentCv> {
    if (!cvId || cvId.trim() === '') {
      throw new BadRequestException('CV ID is required');
    }

    const cv = await this.cvRepository.findOne({
      where: { cvID: cvId.trim() },
      relations: ['student', 'interviews']
    });

    if (!cv) {
      throw new NotFoundException(`CV with ID ${cvId} not found`);
    }

    if (!fs.existsSync(cv.filePath)) {
      throw new NotFoundException(`PDF file not found at: ${cv.filePath}`);
    }

    return cv;
  }

  async getCvFileInfoByStudentId(studentId: string): Promise<StudentCv> {
    if (!studentId || studentId.trim() === '') {
      throw new BadRequestException('Student ID is required');
    }

    const cv = await this.cvRepository.findOne({
      where: { studentID: studentId.trim() },
      relations: ['student'],
      order: { cvID: 'DESC' }
    });

    if (!cv) {
      throw new NotFoundException(`No CV found for student ${studentId}`);
    }

    if (!fs.existsSync(cv.filePath)) {
      throw new NotFoundException(`PDF file not found at: ${cv.filePath}`);
    }

    return cv;
  }

  async findByCvId(cvId: string): Promise<StudentCv> {
    if (!cvId || cvId.trim() === '') {
      throw new BadRequestException('CV ID is required');
    }

    const cv = await this.cvRepository.findOne({
      where: { cvID: cvId.trim() },
      relations: ['student', 'interviews']
    });

    if (!cv) {
      throw new NotFoundException(`CV with ID ${cvId} not found`);
    }

    return cv;
  }

  async getStudentCvList(studentId: string): Promise<StudentCv[]> {
    if (!studentId || studentId.trim() === '') {
      throw new BadRequestException('Student ID is required');
    }

    return await this.cvRepository.find({
      where: { studentID: studentId.trim() },
      relations: ['student'],
      order: { cvID: 'DESC' }
    });
  }

  async update(cvId: string, fileName?: string): Promise<StudentCv> {
    if (!cvId || cvId.trim() === '') {
      throw new BadRequestException('CV ID is required');
    }

    const cv = await this.findByCvId(cvId);
    
    if (fileName && fileName.trim() !== '') {
      const sanitizedFileName = fileName.trim();
      
      if (!sanitizedFileName.endsWith('.pdf')) {
        throw new BadRequestException('Filename must have .pdf extension');
      }

      const oldPath = cv.filePath;
      const newPath = path.join(this.uploadsDir, sanitizedFileName);
      
      if (fs.existsSync(newPath) && oldPath !== newPath) {
        throw new BadRequestException(`File ${sanitizedFileName} already exists`);
      }

      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        cv.filePath = newPath;
        cv.fileName = sanitizedFileName;
      } else {
        throw new NotFoundException('Original CV file not found on disk');
      }
    }

    return await this.cvRepository.save(cv);
  }

  async remove(cvId: string): Promise<void> {
    if (!cvId || cvId.trim() === '') {
      throw new BadRequestException('CV ID is required');
    }

    const cv = await this.findByCvId(cvId);
    
    if (cv.filePath && fs.existsSync(cv.filePath)) {
      try {
        fs.unlinkSync(cv.filePath);
      } catch (error) {
        console.error('Failed to delete physical file:', error);
      }
    }
    
    await this.cvRepository.remove(cv);
  }

  async downloadCV(cvId: string): Promise<{ filePath: string; fileName: string }> {
    if (!cvId || cvId.trim() === '') {
      throw new BadRequestException('CV ID is required');
    }

    const cv = await this.findByCvId(cvId);
    
    if (!fs.existsSync(cv.filePath)) {
      throw new NotFoundException(`PDF file not found at: ${cv.filePath}`);
    }

    return {
      filePath: cv.filePath,
      fileName: cv.fileName
    };
  }
}
