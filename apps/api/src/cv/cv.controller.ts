import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';

@Controller('cv')
@UseGuards(JwtAuthGuard)
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post('upload/:studentID')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCv(
    @Param('studentID') studentID: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('CV file (field name "file") is required for upload.');
    }
    
    return this.cvService.createWithFile(studentID, file);
  }

  @Get(':cvId/link')
  async getCvLink(@Param('cvId') cvId: string) {
    const cv = await this.cvService.findOne(cvId);
    
    // Use cv.fileName as the Drive ID
    const driveId = cv?.fileName; 
    
    if (!cv || !driveId) {
      throw new NotFoundException('CV record or Drive ID not found.');
    }
    
    return {
      cvId,
      // Note to client: The 'fileName' property here IS the Drive ID
      driveId: driveId, 
      shareLink: this.cvService.getDriveShareLink(driveId),
    };
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
    @Body(ValidationPipe) updateCvDto: UpdateCvDto,
  ) {
    return this.cvService.update(cvId, updateCvDto);
  }

  @Delete(':cvId')
  async remove(@Param('cvId') cvId: string) {
    await this.cvService.remove(cvId);
    return { message: 'CV and corresponding Drive file deleted successfully' };
  }
}