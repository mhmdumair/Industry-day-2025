import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QueueDto {
  @IsString()
  @IsNotEmpty()
  queueID: string;

  @IsString()
  @IsNotEmpty()
  stallID: string;
}

export class CreateQueueDto {
  @ValidateNested()
  @Type(() => QueueDto)
  queue: QueueDto;
}
