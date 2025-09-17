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
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
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
  async findByUserId(@Req() req: AuthenticatedRequest) {
    const student = await this.studentService.findByUserId(req.user.userID);
    if (!student) {
      throw new NotFoundException('Student profile not found for the authenticated user.');
    }
    return student;
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