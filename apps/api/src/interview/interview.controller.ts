import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { CreateInterviewByRegNoDto, CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { InterviewStatus } from './entities/interview.entity';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';

@Controller('interview')
@UseGuards(JwtAuthGuard)

export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  // Basic CRUD
  @Post()
  create(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewService.create(createInterviewDto);
  }

  @Post('bulk')
  bulkCreate(@Body() createInterviewDtos: CreateInterviewDto[]) {
    return this.interviewService.bulkCreate(createInterviewDtos);
  }

  // Prelist specific routes
  @Post('prelist')
  createPrelist(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewService.createPrelist(createInterviewDto);
  }

  @Post('prelist/bulk')
  bulkCreatePrelist(@Body() createInterviewDtos: CreateInterviewDto[]) {
    return this.interviewService.bulkCreatePrelist(createInterviewDtos);
  }

  // Walk-in specific routes
  @Post('walkin')
  createWalkin(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewService.createWalkin(createInterviewDto);
  }

  @Post('by-regno')
  createInterviewByRegNo(@Body() dto: CreateInterviewByRegNoDto) {
    return this.interviewService.createInterviewByRegNo(dto);
  }

  @Get()
  findAll() {
    return this.interviewService.findAll();
  }

  @Get('student/:studentID')
  findByStudent(@Param('studentID') studentID: string) {
    return this.interviewService.findByStudentId(studentID);
  }

  @Get('stall/:stallID/inqueue')
  findByStall(@Param('stallID') stallID: string) {
    return this.interviewService.findByStallId(stallID);
  }

  @Get('company/:companyID')
  findByCompany(@Param('companyID') companyID: string) {
    return this.interviewService.findByCompanyId(companyID);
  }

  @Get('company/:companyID/prelisted')
  getPrelistedByCompany(@Param('companyID') companyID: string) {
    return this.interviewService.getPrelistedByCompany(companyID);
  }

  @Get('company/:companyID/prelisted/inqueue')
  getPrelistedScheduledByCompany(@Param('companyID') companyID: string) {
    return this.interviewService.getPrelistedScheduledByCompany(companyID);
  }

  @Get('company/:companyID/walkin')
  getWalkinByCompany(@Param('companyID') companyID: string) {
    return this.interviewService.getWalkinByCompany(companyID);
  }

  @Get('company/:companyID/walkin/scheduled')
  getWalkinScheduledByCompany(@Param('companyID') companyID: string) {
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
  getPrelistedSortedByStudent(@Param('studentID') studentID: string) {
    return this.interviewService.getPrelistedSortedByStudent(studentID);
  }

  @Get('student/:studentID/walkin/sorted')
  getWalkinSortedByStudent(@Param('studentID') studentID: string) {
    return this.interviewService.getWalkinSortedByStudent(studentID);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewService.findOne(id);
  }

  @Patch(':id/student-preference')
  setStudentPreference(
    @Param('id') id: string,
    @Body() body: { student_preference: number },
  ) {
    return this.interviewService.setStudentPreference(
      id,
      body.student_preference,
    );
}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInterviewDto: UpdateInterviewDto) {
    return this.interviewService.update(id, updateInterviewDto);
  }

  // Status change routes
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() statusDto: { status: InterviewStatus }
  ) {
    return this.interviewService.updateStatus(id, statusDto.status);
  }

  @Patch(':id/schedule')
  scheduleInterview(@Param('id') id: string) {
    return this.interviewService.scheduleInterview(id);
  }

  @Patch(':id/complete')
  completeInterview(
    @Param('id') id: string,
  ) {
    return this.interviewService.completeInterview(id);
  }

  @Patch(':id/cancel')
  cancelInterview(@Param('id') id: string) {
    return this.interviewService.cancelInterview(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewService.remove(id);
  }

  @Delete('prelisted/:id')
  removePrelistedInterview(@Param('id') id: string) {
    return this.interviewService.removePrelistedInterview(id);
  }
}
