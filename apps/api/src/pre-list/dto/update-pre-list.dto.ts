import { PartialType } from '@nestjs/mapped-types';
import { CreatePreListDto } from './create-pre-list.dto';

export class UpdatePreListDto extends PartialType(CreatePreListDto) {}
