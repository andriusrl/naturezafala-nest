import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Point } from '../../point/entities/point.entity';
import { User } from '../../user/entities/user.entity';

@Entity('comment', { schema: 'public' })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'int4' })
    @ManyToOne(type => Point, point => point.comment)
    @JoinColumn({ name: 'point' })
    point: Point;
    
    @Column({ type: 'timestamp' })
    date: Date;
    
    @Column({ type: 'int4' })
    @ManyToOne(type => User, user => user.comment)
    @JoinColumn({ name: 'user' })
    user: User;
}
