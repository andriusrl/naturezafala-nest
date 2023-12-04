import { TokenEntity } from 'src/token/token.entity';
import { Comment } from 'src/models/public/comment/entities/comment.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PointVote } from '../../pointVote/entities/pointVote.entity';
import { Point } from '../../point/entities/point.entity';

@Entity('user', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int8' })
  public id?: number;

  @Column({ type: 'varchar', length: 255 })
  public name?: string;

  @Column({ type: 'timestamp', name: 'birth_date' })
  public birthDate?: Date;

  @Column({ type: 'varchar', length: 25 })
  public fone?: string;

  @Column({ type: 'varchar', length: 11 })
  public cpf?: string;

  @Column({ type: 'varchar', length: 255 })
  public email?: string;

  @Column({ type: 'int4' })
  public type?: number;

  @Column({ type: 'varchar', length: 30 })
  public password?: string;

  @Column({ type: 'boolean' })
  public status?: boolean;

  @OneToMany((type) => PointVote, (pointVote) => pointVote.user)
  pointVote: PointVote[];

  @OneToMany((type) => Point, (point) => point.user)
  point: Point[];

  @OneToOne(() => TokenEntity, (tokenEntity) => tokenEntity.user)
  tokenEntity: TokenEntity;

  @OneToOne(() => Comment, (comment) => comment.user)
  comment: Comment;
}
