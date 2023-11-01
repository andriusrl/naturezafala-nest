import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comment', { schema: 'public' })
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'int4' })
    point: number;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ type: 'int4' })
    user: number;
}
