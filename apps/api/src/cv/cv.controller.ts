// src/cv/cv.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch,
  Param, 
  Delete,
  ValidationPipe
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  async create(@Body(ValidationPipe) createCvDto: CreateCvDto) {
    return this.cvService.create(createCvDto);
  }

  @Post('bulk')
  async bulkCreate(@Body(ValidationPipe) createCvDtos: CreateCvDto[]) {
    return this.cvService.bulkCreate(createCvDtos);
  }

  @Get()
  async findAll() {
    return this.cvService.findAll();
  }

  @Get('student/:studentId')
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.cvService.findByStudentId(studentId);
  }

  @Get('student/:studentId/list')
  async getStudentCvList(@Param('studentId') studentId: string) {
    return this.cvService.getStudentCvList(studentId);
  }

  @Get('student/:studentId/has-cv')
  async checkStudentHasCv(@Param('studentId') studentId: string) {
    const hasCv = await this.cvService.checkStudentHasCv(studentId);
    return { studentId, hasCv };
  }

  @Get(':cvId')
  async findOne(@Param('cvId') cvId: string) {
    return this.cvService.findOne(cvId);
  }

  @Patch(':cvId')
  async update(
    @Param('cvId') cvId: string, 
    @Body(ValidationPipe) updateCvDto: UpdateCvDto
  ) {
    return this.cvService.update(cvId, updateCvDto);
  }

  @Delete(':cvId')
  async remove(@Param('cvId') cvId: string) {
    await this.cvService.remove(cvId);
    return { message: 'CV deleted successfully' };
  }
}