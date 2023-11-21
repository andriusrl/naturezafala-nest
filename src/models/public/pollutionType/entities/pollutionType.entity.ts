import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PointVote } from '../../pointVote/entities/pointVote.entity';
import { Point } from '../../point/entities/point.entity';

@Entity('pollution_type', { schema: 'public' })
export class PollutionType {
  @PrimaryGeneratedColumn({ type: 'int8' })
  public id?: number;

  @Column({ type: 'int4' })
  public name: string;

  @Column({ type: 'text' })
  public description?: string;

  @OneToMany((type) => Point, (point) => point.pollutionType) point: Point[];
}
