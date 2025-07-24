import { PartialType } from '@nestjs/mapped-types';
import { CreateStallDto } from './create-stall.dto';

export class UpdateStallDto extends PartialType(CreateStallDto) {}
