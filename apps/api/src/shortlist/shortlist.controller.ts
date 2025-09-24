import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { ShortlistService } from './shortlist.service';
import { CreateShortlistDto } from './dto/create-shortlist.dto';
import { UpdateShortlistDto } from './dto/update-shortlist.dto';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';

@Controller('shortlist')
@UseGuards(JwtAuthGuard)

@UseInterceptors(ClassSerializerInterceptor)
export class ShortlistController {
  constructor(private readonly shortlistService: ShortlistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createShortlistDto: CreateShortlistDto) {
    return await this.shortlistService.create(createShortlistDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.shortlistService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.shortlistService.findOne(id);
  }

  @Get('student/:studentId')
  @HttpCode(HttpStatus.OK)
  async findByStudentId(@Param('studentId') studentId: string) {
    return await this.shortlistService.findByStudentId(studentId);
  }

  @Get('company/:companyId')
  @HttpCode(HttpStatus.OK)
  async findByCompanyId(@Param('companyId') companyId: string) {
    return await this.shortlistService.findByCompanyId(companyId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateShortlistDto: UpdateShortlistDto) {
    return await this.shortlistService.update(id, updateShortlistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.shortlistService.remove(id);
  }
}
