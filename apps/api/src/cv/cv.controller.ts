// src/cv/cv.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch,
  Param, 
  Delete,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  async create(@Body() createCvDto: CreateCvDto) {
    return this.cvService.create(createCvDto);
  }

  @Get()
  async findAll() {
    return this.cvService.findAll();
  }

  @Get(':cvId')
  async findOne(@Param('cvId') cvId: string) {
    return this.cvService.findOne(cvId);
  }

  @Get('student/:studentId')
  async findByStudentId(@Param('studentId') studentId: string) {
    return this.cvService.findByStudentId(studentId);
  }

  @Get('student/:studentId/list')
  async getStudentCvList(@Param('studentId') studentId: string) {
    return this.cvService.getStudentCvList(studentId);
  }

  @Patch(':cvId')
  async update(
    @Param('cvId') cvId: string, 
    @Body() updateCvDto: UpdateCvDto
  ) {
    return this.cvService.update(cvId, updateCvDto);
  }

  @Delete(':cvId')
  async remove(@Param('cvId') cvId: string) {
    await this.cvService.remove(cvId);
    return { message: 'CV deleted successfully' };
  }
}
