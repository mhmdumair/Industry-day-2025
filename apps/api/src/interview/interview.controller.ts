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

  @Get('company/:companyID/prelisted')
  getPrelistedByCompany(
    @Param('companyID') companyID: string,
  ) {
    return this.interviewService.getPrelistedByCompany(companyID);
  }

  // New route: Get pre-listed scheduled interviews by company
  @Get('company/:companyID/prelisted/scheduled')
  getPrelistedScheduledByCompany(
    @Param('companyID') companyID: string,
  ) {
    return this.interviewService.getPrelistedScheduledByCompany(companyID);
  }

  @Get('company/:companyID/walkin')
  getWalkinByCompany(
    @Param('companyID') companyID: string,
  ) {
    return this.interviewService.getWalkinByCompany(companyID);
  }

  // New route: Get walk-in scheduled interviews by company
  @Get('company/:companyID/walkin/scheduled')
  getWalkinScheduledByCompany(
    @Param('companyID') companyID: string,
  ) {
    return this.interviewService.getWalkinScheduledByCompany(companyID);
  }

  @Get('company/:companyID/walkin/count')
  getWalkinCountByCompany(@Param('companyID') companyID: string) {
    return this.interviewService.getWalkinCountByCompany(companyID);
  }

  @Get('company/:companyID/stall/:stallID/next-walkin')
  getNextWalkinInterview(
    @Param('companyID') companyID: string,
    @Param('stallID') stallID: string,
    @Query('count') count?: number,
  ) {
    const interviewCount = count ? parseInt(count.toString(), 10) : 1;
    return this.interviewService.getNextWalkinInterview(companyID, stallID, interviewCount);
  }

  @Get('student/:studentID/prelisted/sorted')
  getPrelistedSortedByStudent(
    @Param('studentID') studentID: string,
  ) {
    return this.interviewService.getPrelistedSortedByStudent(studentID);
  }

  @Get('student/:studentID/walkin/sorted')
  getWalkinSortedByStudent(
    @Param('studentID') studentID: string,
  ) {
    return this.interviewService.getWalkinSortedByStudent(studentID);
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