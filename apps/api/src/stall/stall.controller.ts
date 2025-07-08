import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StallService } from './stall.service';
import { CreateStallDto } from './dto/create-stall.dto';
import { UpdateStallDto } from './dto/update-stall.dto';

@Controller('stall')
export class StallController {
  constructor(private readonly stallService: StallService) {}

  @Post()
  create(@Body() createStallDto: CreateStallDto) {
    return this.stallService.create(createStallDto);
  }

  @Get()
  findAll() {
    return this.stallService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stallService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStallDto: UpdateStallDto) {
    return this.stallService.update(+id, updateStallDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stallService.remove(+id);
  }
}
