import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  roomName: string;

  @IsString()
  location: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
