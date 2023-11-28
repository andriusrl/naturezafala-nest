import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Point } from '../../point/entities/point.entity';
import { User } from '../../user/entities/user.entity';

@Entity('point_vote', { schema: 'public' })
export class PointVote {
  @PrimaryColumn({ type: 'int4' })
  point: Point;

  @Column({ type: 'int4' })
  @ManyToOne((type) => User, (user) => user.pointVote)
  @JoinColumn({ name: 'user' })
  user: User;

  @Column({ type: 'bool' })
  vote: boolean;

  // @Column({ type: 'int4' })
  // @ManyToOne(type => Point, point => point.image)
  // @JoinColumn({ name: 'point' })
  // point: Point;
}
