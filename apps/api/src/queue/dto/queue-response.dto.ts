import { Interview } from '../../typeorm/entities';

export class QueueResponseDto {
  queueID: string;
  interviews: (Interview | null)[];
}
