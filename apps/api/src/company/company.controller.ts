import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userID: string;
    email: string;
    role: string;
  };
}

@Controller('company')
@UseGuards(JwtAuthGuard) 
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Post('bulk')
  bulkCreate(@Body() createCompanyDtos: CreateCompanyDto[]) {
    return this.companyService.bulkCreate(createCompanyDtos);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get('by-user')
  findByUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userID;
    return this.companyService.findByUserId(userId);
  }

  @Get('name')
  findCompanyName(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userID;
    return this.companyService.getCompanyNameByUserId(userId);
  }

@Get('by-user/:userId')
  findByUserId(@Query('userId') userId: string) {
    return this.companyService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}