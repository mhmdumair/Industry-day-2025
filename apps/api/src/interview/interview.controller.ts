import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  create(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewService.create(createInterviewDto);
  }

  @Get()
  findAll() {
    return this.interviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInterviewDto: UpdateInterviewDto) {
    return this.interviewService.update(id, updateInterviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewService.remove(id);
  }

  // --- Filter routes ---

  @Get('student/:studentID')
  findByStudent(@Param('studentID') studentID: string) {
    return this.interviewService.findByStudentId(studentID);
  }

  @Get('stall/:stallID')
  findByStall(@Param('stallID') stallID: string) {
    return this.interviewService.findByStallId(stallID);
  }

  @Get('company/:companyID')
  findByCompany(@Param('companyID') companyID: string) {
    return this.interviewService.findByCompanyId(companyID);
  }

  @Get('room/:roomID')
  findByRoom(@Param('roomID') roomID: string) {
    return this.interviewService.findByRoomId(roomID);
  }

}
