import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCv } from './entities/student-cv.entity';
import { Student } from '../student/entities/student.entity';
import { CreateCvDto, CreateCvByRegnoDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { StudentService } from '../student/student.service';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(StudentCv)
    private cvRepository: Repository<StudentCv>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private readonly studentService: StudentService,
  ) {}

  async create(createCvDto: CreateCvDto): Promise<StudentCv> {
    try {
      const student = await this.studentRepository.findOne({
        where: { studentID: createCvDto.studentID },
      });

      if (!student) {
        throw new NotFoundException(
          `Student with ID ${createCvDto.studentID} does not exist`,
        );
      }

      const existingCv = await this.cvRepository.findOne({
        where: { studentID: createCvDto.studentID },
      });

      if (existingCv) {
        throw new ConflictException(
          `A CV for student ID ${createCvDto.studentID} already exists.`,
        );
      }

      const cv = this.cvRepository.create(createCvDto);
      return await this.cvRepository.save(cv);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create CV');
    }
  }

  async createByRegNo(createCvByRegnoDto: CreateCvByRegnoDto): Promise<StudentCv> {
    const { regNo, fileName } = createCvByRegnoDto;
    try {
      const student = await this.studentService.findByRegNo(regNo);
      if (!student) {
        throw new NotFoundException(
          `Student with registration number ${regNo} does not exist`,
        );
      }
      const existingCv = await this.cvRepository.findOne({
        where: { studentID: student.studentID },
      });
      if (existingCv) {
        throw new ConflictException(`This student already has a CV.`);
      }
      const cv = this.cvRepository.create({
        studentID: student.studentID,
        fileName,
      });
      return await this.cvRepository.save(cv);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
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
          where: { studentID: dto.studentID },
        });

        if (!student) {
          failed.push({
            dto,
            error: `Student with ID ${dto.studentID} does not exist`,
          });
          continue;
        }

        const existingCv = await this.cvRepository.findOne({
          where: { studentID: dto.studentID },
        });

        if (existingCv) {
          failed.push({
            dto,
            error: `A CV for student ID ${dto.studentID} already exists.`,
          });
          continue;
        }

        const cv = this.cvRepository.create(dto);
        const saved = await this.cvRepository.save(cv);
        successful.push(saved);
      } catch (error) {
        failed.push({
          dto: createCvDtos[i],
          error: error.message || 'Failed to create CV',
        });
      }
    }

    return {
      successful,
      failed,
      summary: {
        total: createCvDtos.length,
        successful: successful.length,
        failed: failed.length,
      },
    };
  }

  async bulkCreateByRegNo(createCvByRegnoDtos: CreateCvByRegnoDto[]) {
    const successful: StudentCv[] = [];
    const failed: { dto: CreateCvByRegnoDto; error: string }[] = [];

    for (const dto of createCvByRegnoDtos) {
      const { regNo, fileName } = dto;

      try {
        const student = await this.studentService.findByRegNo(regNo);

        if (!student) {
          failed.push({
            dto,
            error: `Student with registration number ${regNo} does not exist`,
          });
          continue;
        }
        const existingCv = await this.cvRepository.findOne({
          where: { studentID: student.studentID },
        });

        if (existingCv) {
          failed.push({
            dto,
            error: `This student already has a CV.`,
          });
          continue;
        }

        const cv = this.cvRepository.create({
          studentID: student.studentID,
          fileName,
        });

        const saved = await this.cvRepository.save(cv);
        successful.push(saved);
      } catch (error) {
        failed.push({
          dto,
          error: error.message || 'Failed to create CV',
        });
      }
    }

    return {
      successful,
      failed,
      summary: {
        total: createCvByRegnoDtos.length,
        successful: successful.length,
        failed: failed.length,
      },
    };
  }

  async findAll(): Promise<StudentCv[]> {
    try {
      return await this.cvRepository.find({
        relations: ['student'],
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

  async findCvByRegNo(regNo: string): Promise<StudentCv | null> {
    try {
      if (!regNo || regNo.trim() === '') {
        throw new BadRequestException('Registration number is required');
      }

      const student = await this.studentService.findByRegNo(regNo);

      if (!student) {
        throw new NotFoundException(
          `Student with registration number ${regNo} not found`,
        );
      }

      return await this.cvRepository.findOne({
        where: { studentID: student.studentID },
        relations: ['student'],
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch CV by registration number',
      );
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
      await this.cvRepository.remove(cv);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete CV');
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
}
