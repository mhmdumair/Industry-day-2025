import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, NotFoundException, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';

interface AuthenticatedRequest extends Request {
  user: {
    userID: string;
    email: string;
    role: string;
  };
}

const pdfFileFilter = (req, file, callback) => {
  if (file.mimetype !== 'application/pdf') {
    return callback(new BadRequestException('Only PDF files are allowed for the CV upload.'), false);
  }
  callback(null, true);
};

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Patch('profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Profile picture file is required.');
    }

    const student = await this.studentService.findByUserId(req.user.userID);

    if (!student) {
      throw new NotFoundException('Student profile not found for the authenticated user.');
    }

    const updatedUser = await this.studentService.updateProfilePicture(
      student.studentID,
      file,
    );

    return {
      message: 'Profile picture updated successfully',
      profile_picture: updatedUser.profile_picture,
      profile_picture_public_id: updatedUser.profile_picture_public_id,
    };
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('cv_file', { fileFilter: pdfFileFilter }))
  async register(
    @Body() body: { createStudentDto: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('CV PDF file (field name "cv_file") is required for registration.');
    }

    let createStudentDto: CreateStudentDto;
    try {
      const jsonPayload = JSON.parse(body.createStudentDto);
      createStudentDto = plainToInstance(CreateStudentDto, jsonPayload);
      await validateOrReject(createStudentDto);
    } catch (e) {
      throw new BadRequestException('Invalid registration payload or failed DTO validation.');
    }

    return this.studentService.register(createStudentDto, file);
  }

  @Post()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('cv_file', { fileFilter: pdfFileFilter }))
async create(
  @Body() body: any,
  @UploadedFile() file?: Express.Multer.File,
) {
  console.log('=== CREATE STUDENT DEBUG ===');
  console.log('Body received:', body);
  console.log('File received:', file ? 'Yes' : 'No');
  
  let createStudentDto: CreateStudentDto;
  if (body.createStudentDto) {
    try {
      console.log('Parsing createStudentDto string...');
      const jsonPayload = JSON.parse(body.createStudentDto);
      console.log('Parsed JSON:', jsonPayload);
      
      createStudentDto = plainToInstance(CreateStudentDto, jsonPayload);
      console.log('Plain to instance done');
      
      await validateOrReject(createStudentDto);
      console.log('Validation passed');
    } catch (e) {
      console.error('VALIDATION ERROR:', e);
      throw new BadRequestException(`Invalid payload or failed DTO validation: ${JSON.stringify(e)}`);
    }
  } else {
    createStudentDto = plainToInstance(CreateStudentDto, body);
    try {
      await validateOrReject(createStudentDto);
    } catch (e) {
      console.error('VALIDATION ERROR (JSON):', e);
      throw new BadRequestException(`Invalid payload or failed DTO validation: ${JSON.stringify(e)}`);
    }
  }

  console.log('About to call service.create...');
  return this.studentService.create(createStudentDto, file);
}

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  createBulk(@Body() createStudentDtos: CreateStudentDto[]) {
    return this.studentService.createBulk(createStudentDtos);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.studentService.findAll();
  }

  @Get('filter')
  @UseGuards(JwtAuthGuard)
  filterByGroupAndLevel(
    @Query('group') group?: string,
    @Query('level') level?: string,
  ) {
    return this.studentService.filterByGroupAndLevel(group, level);
  }

  @Get('by-user')
  @UseGuards(JwtAuthGuard)
  async findByUser(@Req() req: AuthenticatedRequest) {
    const student = await this.studentService.findByUserId(req.user.userID);
    if (!student) {
      throw new NotFoundException('Student profile not found for the authenticated user.');
    }
    return student;
  }

  @Get('by-user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUserId(@Query('userId') userId: string) {
    return this.studentService.findByUserId(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}