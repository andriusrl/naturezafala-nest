import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';


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
    user: number;

    @Column({ type: 'int4' })
    latitude: number;

    @Column({ type: 'int4' })
    longitude: number;
}
