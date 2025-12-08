import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCv } from './entities/student-cv.entity';
import { Student } from '../student/entities/student.entity';
import { UpdateCvDto } from './dto/update-cv.dto';
import { StudentService } from '../student/student.service';
import { GoogleDriveService } from './../google-drive/google-drive.service';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(StudentCv)
    public cvRepository: Repository<StudentCv>, 
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @Inject(forwardRef(() => StudentService)) 
    private readonly studentService: StudentService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  public async uploadCvFile(file: Express.Multer.File, filename: string): Promise<string> {
    return this.googleDriveService.uploadFile(file, filename);
  }

  public async deleteCvFile(fileId: string): Promise<void> {
    return this.googleDriveService.deleteFile(fileId);
  }

  // Used during initial registration
  async createWithFile(
    studentID: string,
    file: Express.Multer.File,
  ): Promise<StudentCv> {
    try {
      const student = await this.studentRepository.findOne({ where: { studentID } });
      if (!student) {
        throw new NotFoundException(`Student ID ${studentID} does not exist`);
      }

      const existingCv = await this.cvRepository.findOne({ where: { studentID } });
      if (existingCv) {
        throw new ConflictException(`A CV for student ID ${studentID} already exists.`);
      }

      // --- NAMING LOGIC CHANGED ---
      // Replace slashes with empty string (e.g., S/20/534 -> S20534)
      const cleanedRegNo = student.regNo.replace(/\//g, ''); 
      const originalExtension = file.originalname.split('.').pop();
      const driveFilename = `${cleanedRegNo}.${originalExtension}`;

      const driveFileId = await this.uploadCvFile(
        file,
        driveFilename,
      );

      const cv = this.cvRepository.create({
        studentID: studentID,
        fileName: driveFileId, 
      });
      return await this.cvRepository.save(cv);

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create CV record and upload file');
    }
  }

  // Handles replacing existing CV OR creating new one if missing
  async updateCvFile(
    studentID: string,
    file: Express.Multer.File,
  ): Promise<StudentCv> {
    try {
        const student = await this.studentRepository.findOne({ where: { studentID } });
        if (!student) {
            throw new NotFoundException(`Student ID ${studentID} does not exist`);
        }

        // Check if CV exists
        let cv = await this.cvRepository.findOne({ where: { studentID } });

        // --- NAMING LOGIC CHANGED ---
        // Replace slashes with empty string (e.g., S/20/534 -> S20534)
        const cleanedRegNo = student.regNo.replace(/\//g, '');
        const originalExtension = file.originalname.split('.').pop();
        const driveFilename = `${cleanedRegNo}.${originalExtension}`;

        if (cv) {
            // CASE 1: CV Exists - Replace it
            if (cv.fileName) {
                try {
                    await this.deleteCvFile(cv.fileName);
                } catch (error) {
                    console.warn(`Failed to delete old CV file ${cv.fileName}, proceeding with new upload.`);
                }
            }

            // Upload new file
            const newDriveFileId = await this.uploadCvFile(file, driveFilename);

            // Update DB record
            cv.fileName = newDriveFileId;
            return await this.cvRepository.save(cv);
        } else {
            // CASE 2: CV Does Not Exist - Create New
            const newDriveFileId = await this.uploadCvFile(file, driveFilename);
            const newCv = this.cvRepository.create({
                studentID: studentID,
                fileName: newDriveFileId,
            });
            return await this.cvRepository.save(newCv);
        }

    } catch (error) {
        if (error instanceof NotFoundException) throw error;
        throw new InternalServerErrorException('Failed to update CV file');
    }
  }

  async findAll(): Promise<StudentCv[]> {
    try {
      return await this.cvRepository.find({ relations: ['student'] });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch CVs');
    }
  }

  async findOne(cvId: string): Promise<StudentCv> {
    try {
      if (!cvId || cvId.trim() === '') {
        throw new BadRequestException('CV ID is required');
      }

      const cv = await this.cvRepository.findOne({
        where: { cvID: cvId.trim() },
        relations: ['student'],
      });

      if (!cv) {
        throw new NotFoundException(`CV with ID ${cvId} not found`);
      }

      return cv;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch CV');
    }
  }

  async findByStudentId(studentId: string): Promise<StudentCv | null> {
    try {
      if (!studentId || studentId.trim() === '') {
        throw new BadRequestException('Student ID is required');
      }

      return await this.cvRepository.findOne({
        where: { studentID: studentId.trim() },
        relations: ['student'],
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch CV by student ID');
    }
  }

  async getStudentCvList(studentId: string): Promise<StudentCv[]> {
    try {
      if (!studentId || studentId.trim() === '') {
        throw new BadRequestException('Student ID is required');
      }

      return await this.cvRepository.find({
        where: { studentID: studentId.trim() },
        relations: ['student'],
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch student CV list');
    }
  }

  async update(cvId: string, updateCvDto: UpdateCvDto): Promise<StudentCv> {
    try {
      const cv = await this.findOne(cvId);

      const updatedCv = this.cvRepository.merge(cv, updateCvDto);
      return await this.cvRepository.save(updatedCv);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update CV');
    }
  }

  async remove(cvId: string): Promise<void> {
    try {
      const cv = await this.findOne(cvId);

      if (cv.fileName) {
        await this.deleteCvFile(cv.fileName);
      }

      await this.cvRepository.remove(cv);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete CV record or file from Drive');
    }
  }

  async checkStudentHasCv(studentId: string): Promise<boolean> {
    try {
      const count = await this.cvRepository.count({
        where: { studentID: studentId },
      });
      return count > 0;
    } catch (error) {
      throw new InternalServerErrorException('Failed to check student CV status');
    }
  }

  getDriveShareLink(driveId: string): string {
    return this.googleDriveService.getShareLink(driveId);
  }
}