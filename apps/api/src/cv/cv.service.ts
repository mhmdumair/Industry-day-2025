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
  constructor(
    @InjectRepository(StudentCv)
    private cvRepository: Repository<StudentCv>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async uploadCV(file: Express.Multer.File, studentID: string): Promise<StudentCv> {
    try {
      // Validate input parameters
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      if (!studentID || studentID.trim() === '') {
        throw new BadRequestException('Student ID is required');
      }

      // Get student details including regNo
      const student = await this.studentRepository.findOne({
        where: { studentID: studentID.trim() }
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentID} does not exist`);
      }

      if (!student.regNo || student.regNo.trim() === '') {
        throw new BadRequestException(`Student ${studentID} does not have a valid registration number`);
      }

      // Create new filename using student regNo
      const sanitizedRegNo = student.regNo.replace(/[^a-zA-Z0-9]/g, '_');
      const newFileName = `${sanitizedRegNo}.pdf`;
      const newFilePath = path.resolve('./uploads', newFileName);

      // Ensure uploads directory exists
      const uploadsDir = path.resolve('./uploads');
      try {
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
      } catch (dirError) {
        console.error('Failed to create uploads directory:', dirError);
        throw new InternalServerErrorException('Failed to create uploads directory');
      }

      // Check if file with same name already exists
      if (fs.existsSync(newFilePath)) {
        console.warn(`File ${newFileName} already exists, it will be overwritten`);
      }

      // Validate source file exists
      if (!fs.existsSync(file.path)) {
        throw new BadRequestException('Uploaded file not found on server');
      }

      // Rename the uploaded file
      try {
        fs.renameSync(file.path, newFilePath);
        console.log(`File renamed from ${file.path} to ${newFilePath}`);
      } catch (renameError) {
        console.error('File rename error:', renameError);
        throw new InternalServerErrorException(`Failed to save uploaded file: ${renameError.message}`);
      }

      // Check if there's already a CV for this student
      const existingCV = await this.cvRepository.findOne({
        where: { studentID: studentID }
      });

      let savedCV: StudentCv;

      if (existingCV) {
        // Update existing CV record
        try {
          // Delete old physical file if it exists and is different
          if (existingCV.filePath !== newFilePath && fs.existsSync(existingCV.filePath)) {
            fs.unlinkSync(existingCV.filePath);
            console.log(`Old file deleted: ${existingCV.filePath}`);
          }

          existingCV.fileName = newFileName;
          existingCV.filePath = newFilePath;
          savedCV = await this.cvRepository.save(existingCV);
          console.log(`CV updated for student ${studentID} (RegNo: ${student.regNo}): ${newFileName}`);
        } catch (updateError) {
          console.error('Failed to update existing CV record:', updateError);
          throw new InternalServerErrorException('Failed to update CV record in database');
        }
      } else {
        // Create new CV record
        try {
          const cv = new StudentCv();
          cv.studentID = studentID;
          cv.fileName = newFileName;
          cv.filePath = newFilePath;

          savedCV = await this.cvRepository.save(cv);
          console.log(`CV uploaded for student ${studentID} (RegNo: ${student.regNo}): ${newFileName}`);
        } catch (saveError) {
          console.error('Failed to save CV record:', saveError);
          // Clean up uploaded file if database save fails
          if (fs.existsSync(newFilePath)) {
            fs.unlinkSync(newFilePath);
          }
          throw new InternalServerErrorException('Failed to save CV record in database');
        }
      }

      return savedCV;

    } catch (error) {
      // Clean up uploaded file if any error occurs
      if (file && file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup temporary file:', cleanupError);
        }
      }

      // Re-throw known errors
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }

      // Handle unexpected errors
      console.error('Unexpected error in uploadCV:', error);
      throw new InternalServerErrorException('An unexpected error occurred during file upload');
    }
  }

  async getCvFileInfoById(cvId: string): Promise<{ filePath: string; fileName: string; cvEntity: StudentCv }> {
    try {
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

      // Check if file exists on disk
      if (!cv.filePath || !fs.existsSync(cv.filePath)) {
        throw new NotFoundException('PDF file not found on disk');
      }

      // Verify file is readable
      try {
        fs.accessSync(cv.filePath, fs.constants.R_OK);
      } catch (accessError) {
        console.error('File access error:', accessError);
        throw new InternalServerErrorException('PDF file is not accessible');
      }

      return {
        filePath: cv.filePath,
        fileName: cv.fileName,
        cvEntity: cv
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      
      console.error('Error finding CV by ID:', error);
      throw new InternalServerErrorException('Failed to retrieve CV');
    }
  }

  async getCvFileInfoByStudentId(studentId: string): Promise<{ filePath: string; fileName: string; cvEntity: StudentCv }> {
    try {
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

      // Check if file exists on disk
      if (!cv.filePath || !fs.existsSync(cv.filePath)) {
        throw new NotFoundException('PDF file not found on disk');
      }

      // Verify file is readable
      try {
        fs.accessSync(cv.filePath, fs.constants.R_OK);
      } catch (accessError) {
        console.error('File access error:', accessError);
        throw new InternalServerErrorException('PDF file is not accessible');
      }

      return {
        filePath: cv.filePath,
        fileName: cv.fileName,
        cvEntity: cv
      };

    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      
      console.error('Error finding CV by student ID:', error);
      throw new InternalServerErrorException('Failed to retrieve student CV');
    }
  }

  // Method for getting CV metadata (if needed)
  async findByCvId(cvId: string): Promise<StudentCv> {
    try {
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
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      console.error('Error finding CV by ID:', error);
      throw new InternalServerErrorException('Failed to retrieve CV');
    }
  }

  // Method for getting CV metadata list for student (if needed)
  async getStudentCvList(studentId: string): Promise<StudentCv[]> {
    try {
      if (!studentId || studentId.trim() === '') {
        throw new BadRequestException('Student ID is required');
      }

      const cvs = await this.cvRepository.find({
        where: { studentID: studentId.trim() },
        relations: ['student'],
        order: { cvID: 'DESC' }
      });

      return cvs;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      console.error('Error finding CVs by student ID:', error);
      throw new InternalServerErrorException('Failed to retrieve student CVs');
    }
  }

  async update(cvId: string, fileName?: string): Promise<StudentCv> {
    try {
      if (!cvId || cvId.trim() === '') {
        throw new BadRequestException('CV ID is required');
      }

      const cv = await this.findByCvId(cvId);
      
      if (fileName && fileName.trim() !== '') {
        const sanitizedFileName = fileName.trim();
        
        // Validate filename
        if (!sanitizedFileName.endsWith('.pdf')) {
          throw new BadRequestException('Filename must have .pdf extension');
        }

        // If updating filename, also rename the physical file
        const oldPath = cv.filePath;
        const newPath = path.join('./uploads', sanitizedFileName);
        
        try {
          if (fs.existsSync(oldPath)) {
            // Check if target file already exists
            if (fs.existsSync(newPath) && oldPath !== newPath) {
              throw new BadRequestException(`File ${sanitizedFileName} already exists`);
            }

            fs.renameSync(oldPath, newPath);
            cv.filePath = newPath;
            console.log(`File renamed from ${oldPath} to ${newPath}`);
          } else {
            throw new NotFoundException('Original CV file not found on disk');
          }
          
          cv.fileName = sanitizedFileName;
        } catch (renameError) {
          if (renameError instanceof BadRequestException || renameError instanceof NotFoundException) {
            throw renameError;
          }
          console.error('File rename error:', renameError);
          throw new InternalServerErrorException('Failed to rename CV file');
        }
      }

      const updatedCV = await this.cvRepository.save(cv);
      console.log(`CV updated: ${cv.fileName} for student ${cv.studentID}`);
      
      return updatedCV;
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      console.error('Error updating CV:', error);
      throw new InternalServerErrorException('Failed to update CV');
    }
  }

  async remove(cvId: string): Promise<void> {
    try {
      if (!cvId || cvId.trim() === '') {
        throw new BadRequestException('CV ID is required');
      }

      const cv = await this.findByCvId(cvId);
      
      // Delete physical file from disk
      if (cv.filePath && fs.existsSync(cv.filePath)) {
        try {
          fs.unlinkSync(cv.filePath);
          console.log(`File deleted from disk: ${cv.filePath}`);
        } catch (fileDeleteError) {
          console.error('Failed to delete physical file:', fileDeleteError);
          // Continue with database deletion even if file deletion fails
        }
      } else {
        console.warn(`Physical file not found: ${cv.filePath}`);
      }
      
      // Delete from database
      try {
        await this.cvRepository.remove(cv);
        console.log(`CV deleted: ${cv.fileName} for student ${cv.studentID}`);
      } catch (dbDeleteError) {
        console.error('Failed to delete CV from database:', dbDeleteError);
        throw new InternalServerErrorException('Failed to delete CV from database');
      }

    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      console.error('Error removing CV:', error);
      throw new InternalServerErrorException('Failed to remove CV');
    }
  }

  async downloadCV(cvId: string): Promise<{ filePath: string; fileName: string }> {
    try {
      if (!cvId || cvId.trim() === '') {
        throw new BadRequestException('CV ID is required');
      }

      const cv = await this.findByCvId(cvId);
      
      // Check if file exists on disk
      if (!cv.filePath || !fs.existsSync(cv.filePath)) {
        throw new NotFoundException('PDF file not found on disk');
      }

      // Verify file is readable
      try {
        fs.accessSync(cv.filePath, fs.constants.R_OK);
      } catch (accessError) {
        console.error('File access error:', accessError);
        throw new InternalServerErrorException('PDF file is not accessible');
      }

      return {
        filePath: cv.filePath,
        fileName: cv.fileName
      };
    } catch (error) {
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof InternalServerErrorException) {
        throw error;
      }
      
      console.error('Error downloading CV:', error);
      throw new InternalServerErrorException('Failed to prepare CV for download');
    }
  }
}
