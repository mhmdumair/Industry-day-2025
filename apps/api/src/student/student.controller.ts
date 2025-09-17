import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard'; // Import your JWT guard

interface AuthenticatedRequest extends Request {
  user: {
    userID: string;
    email: string;
    role: string;
  };
}

@Controller('student')
@UseGuards(JwtAuthGuard)

export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Post('bulk')
  createBulk(@Body() createStudentDtos: CreateStudentDto[]) {
    return this.studentService.createBulk(createStudentDtos);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get('filter')
  filterByGroupAndLevel(
    @Query('group') group?: string,
    @Query('level') level?: string,
  ) {
    return this.studentService.filterByGroupAndLevel(group, level);
  }

  @Get('by-user')
  async findByUserId(@Req() req: AuthenticatedRequest) {
    const student = await this.studentService.findByUserId(req.user.userID);
    if (!student) {
      throw new NotFoundException('Student profile not found for the authenticated user.');
    }
    return student;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}