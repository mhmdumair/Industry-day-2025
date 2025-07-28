import { PartialType } from '@nestjs/mapped-types';
import { CreateShortlistDto } from './create-shortlist.dto';

export class UpdateShortlistDto extends PartialType(CreateShortlistDto) {}
