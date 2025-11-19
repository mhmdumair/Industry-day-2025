import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; 
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

interface MultipartBody {
  data: string;
}

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('register')
  createPublic(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.createPublic(createCompanyDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @UploadedFile() logoFile: Express.Multer.File,
    @Body() body: MultipartBody,
  ) {
    if (!body.data) {
      throw new BadRequestException('Company data (data field) is required.');
    }
    
    let createCompanyDto: CreateCompanyDto;
    try {
      createCompanyDto = JSON.parse(body.data);
    } catch (e) {
      throw new BadRequestException('Invalid JSON format in data field.');
    }

    return this.companyService.create(createCompanyDto, logoFile); 
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  bulkCreate(@Body() createCompanyDtos: CreateCompanyDto[]) {
    // 3. Secured bulk creation: handles array of DTOs, no file upload
    return this.companyService.bulkCreate(createCompanyDtos);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.companyService.findAll();
  }

  @Get('by-user')
  @UseGuards(JwtAuthGuard)
  findByUser(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userID;
    return this.companyService.findByUserId(userId);
  }

  @Get('name')
  @UseGuards(JwtAuthGuard)
  findCompanyName(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userID;
    return this.companyService.getCompanyNameByUserId(userId);
  }

  @Get('by-user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUserId(@Query('userId') userId: string) {
    return this.companyService.findByUserId(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}