import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Room } from '../../room/entities/room.entity';
import { Company } from '../../company/entities/company.entity';
import { Interview } from '../../interview/entities/interview.entity';

export enum StallStatus {
  ACTIVE = 'active',
  FINISHED = 'finished',
  PAUSED = 'paused',
  WALKIN = 'walk-in'
}


export enum Preference {
  BT = "BT", //Botany
  ZL = "ZL", //Zoology
  CH = "CH", //Chemistry
  MT = "MT", //Mathematics
  BMS = "BMS", //Biomedical Science
  ST = "ST", //Statistics
  GL = "GL", // Geology
  CS = "CS", //Computer Science
  DS = "DS", //Data Science
  ML = "ML", //Microbiology
  CM = "CM", //Computation and Management
  ES = "ES", //Environmental Science
  MB = "MB", //Molecular Biology
  PH = "PH", //Physics
  ALL = "ALL"
}


@Entity('stalls')
export class Stall {
  @PrimaryGeneratedColumn('uuid')
  stallID: string;

  @Column()
  title : string

  @Column()
  roomID: string;

  @Column()
  companyID: string;

  @Column({type : 'enum',enum :Preference,default: Preference.ALL})
  preference : Preference

  @Column({ type: 'enum', enum: StallStatus })
  status: StallStatus;

  @ManyToOne(() => Room, (room) => room.stalls, { nullable: false })
  @JoinColumn({ name: 'roomID' })
  room: Room;

  @ManyToOne(() => Company, (company) => company.stalls)
  @JoinColumn({ name: 'companyID' })
  company: Company;

  @OneToMany(() => Interview, (interview) => interview.stall)
  interviews: Interview[];

}
