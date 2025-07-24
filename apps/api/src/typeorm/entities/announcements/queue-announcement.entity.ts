import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Announcements } from './announcement.entity';
import { Queue } from '../queue/queue.entity';

@Entity('queue_announcement')
export class QueueAnnouncement {
  @PrimaryColumn()
    queueAnnouncementID: string;

    @Column()
    announcementID: string;

    @Column()
    queueID: string;

    // Relationships
    @ManyToOne(() => Announcements)
    @JoinColumn({ name: 'announcementID' })
    announcement: Announcements;

    @ManyToOne(() => Queue)
    @JoinColumn({ name: 'queueID' })
    queue: Queue;
}