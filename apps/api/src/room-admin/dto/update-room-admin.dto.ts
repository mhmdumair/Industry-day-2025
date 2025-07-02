import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomAdminDto } from './create-room-admin.dto';

export class UpdateRoomAdminDto extends PartialType(CreateRoomAdminDto) {}