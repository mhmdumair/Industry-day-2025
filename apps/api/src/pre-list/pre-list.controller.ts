import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreListService } from './pre-list.service';
import { CreatePreListDto } from './dto/create-pre-list.dto';
import { UpdatePreListDto } from './dto/update-pre-list.dto';

@Controller('pre-list')
export class PreListController {
  constructor(private readonly preListService: PreListService) {}

  @Get('company/:companyID')
  getByCompanyID(@Param('companyID') companyID: string) {
    return this.preListService.getPreListByCompanyId(companyID);
  }

  @Get('student/:studentID')
  getByStudentID(@Param('studentID') studentID: string) {
    return this.preListService.getPreListByStudentId(studentID);
  }

  @Post()
  create(@Body() createPreListDto: CreatePreListDto) {
    return this.preListService.create(createPreListDto);
  }

  @Get()
  findAll() {
    return this.preListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preListService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreListDto: UpdatePreListDto) {
    return this.preListService.update(id, updatePreListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preListService.remove(id);
  }
}
