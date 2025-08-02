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

  // Bulk create interviews
  @Post('bulk')
  bulkCreate(@Body() createInterviewDtos: CreateInterviewDto[]) {
    return this.interviewService.bulkCreate(createInterviewDtos);
  }

  @Get()
  findAll() {
    return this.interviewService.findAll();
  }

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

  @Get('stall/:stallID/prelisted')
  getPrelistedSorted(@Param('stallID') stallID: string) {
    return this.interviewService.getPrelistedSorted(stallID);
  }

  @Get('stall/:stallID/walkin')
  getWalkinSorted(@Param('stallID') stallID: string) {
    return this.interviewService.getWalkinSorted(stallID);
  }

  // New route: Get count of walk-in interviews by stall ID
  @Get('stall/:stallID/walkin/count')
  getWalkinCountByStall(@Param('stallID') stallID: string) {
    return this.interviewService.getWalkinCountByStall(stallID);
  }

  @Get('company/:companyID/prelisted')
  getPrelistedByCompany(
    @Param('companyID') companyID: string,
  ) {
    return this.interviewService.getPrelistedByCompany(companyID);
  }

  @Get('company/:companyID/walkin')
  getWalkinByCompany(
    @Param('companyID') companyID: string,
  ) {
    return this.interviewService.getWalkinByCompany(companyID);
  }

  // New route: Get count of walk-in interviews by company ID
  @Get('company/:companyID/walkin/count')
  getWalkinCountByCompany(@Param('companyID') companyID: string) {
    return this.interviewService.getWalkinCountByCompany(companyID);
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
}