import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../image/entities/image.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { PollutionType } from '../../pollutionType/entities/pollutionType.entity';
import { PointVote } from '../../pointVote/entities/pointVote.entity';
import { User } from '../../user/entities/user.entity';

@Entity('point', { schema: 'public' })
export class Point {
  @PrimaryGeneratedColumn({ type: 'int8' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'int4' })
  @ManyToOne((type) => User, (user) => user.point)
  @JoinColumn({ name: 'user' })
  user: number;

  @Column({ type: 'int4' })
  latitude: number;

  @Column({ type: 'int4' })
  longitude: number;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ name: 'pollution_type', type: 'int4' })
  @ManyToOne((type) => PollutionType, (pollutionType) => pollutionType.point)
  @JoinColumn({ name: 'pollution_type' })
  pollutionType: PollutionType;

  @OneToMany((type) => Image, (image) => image.point) image: Image[];

  @OneToMany((type) => Image, (image) => image.point) comment: Comment[];

  @OneToMany((type) => PointVote, (pointVote) => pointVote.point) pointVote: PointVote[];
}
