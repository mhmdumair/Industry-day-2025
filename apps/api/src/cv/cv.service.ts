// src/cv/cv.service.ts
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  InternalServerErrorException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCv } from './entities/student-cv.entity';
import { Student } from '../student/entities/student.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(StudentCv)
    private cvRepository: Repository<StudentCv>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createCvDto: CreateCvDto): Promise<StudentCv> {
    try {
      const student = await this.studentRepository.findOne({
        where: { studentID: createCvDto.studentID }
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${createCvDto.studentID} does not exist`);
      }

      // Check if student already has a CV (optional - remove if multiple CVs allowed)
      // const existingCv = await this.cvRepository.findOne({
      //   where: { studentID: createCvDto.studentID }
      // });

      // if (existingCv) {
      //   throw new ConflictException(`Student with ID ${createCvDto.studentID} already has a CV`);
      // }

      const cv = this.cvRepository.create(createCvDto);
      return await this.cvRepository.save(cv);
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof BadRequestException || 
          error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create CV');
    }
  }

  async bulkCreate(createCvDtos: CreateCvDto[]) {
    const successful: StudentCv[] = [];
    const failed: { dto: CreateCvDto; error: string }[] = [];

    for (let i = 0; i < createCvDtos.length; i++) {
      try {
        const dto = createCvDtos[i];
        
        const student = await this.studentRepository.findOne({
          where: { studentID: dto.studentID }
        });

        if (!student) {
          failed.push({
            dto,
            error: `Student with ID ${dto.studentID} does not exist`
          });
          continue;
        }

        // Check if student already has a CV
        // const existingCv = await this.cvRepository.findOne({
        //   where: { studentID: dto.studentID }
        // });

        // if (existingCv) {
        //   failed.push({
        //     dto,
        //     error: `Student with ID ${dto.studentID} already has a CV`
        //   });
        //   continue;
        // }

        const cv = this.cvRepository.create(dto);
        const saved = await this.cvRepository.save(cv);
        successful.push(saved);
      } catch (error) {
        failed.push({
          dto: createCvDtos[i],
          error: error.message || 'Failed to create CV'
        });
      }
    }

    return {
      successful,
      failed,
      summary: {
        total: createCvDtos.length,
        successful: successful.length,
        failed: failed.length
      }
    };
  }

  async findAll(): Promise<StudentCv[]> {
    try {
      return await this.cvRepository.find({
        relations: ['student']
      });
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
        relations: ['student']
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
        relations: ['student']
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
        relations: ['student']
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
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update CV');
    }
  }

  async remove(cvId: string): Promise<void> {
    try {
      const cv = await this.findOne(cvId);
      await this.cvRepository.remove(cv);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete CV');
    }
  }

  async checkStudentHasCv(studentId: string): Promise<boolean> {
    try {
      const count = await this.cvRepository.count({
        where: { studentID: studentId }
      });
      return count > 0;
    } catch (error) {
      throw new InternalServerErrorException('Failed to check student CV status');
    }
  }
}