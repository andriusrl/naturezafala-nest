import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Point } from '../../point/entities/point.entity';

@Entity('image', { schema: 'public' })
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ type: 'int4' })
  @ManyToOne((type) => Point, (point) => point.image)
  @JoinColumn({ name: 'point' })
  point: Point;
}
