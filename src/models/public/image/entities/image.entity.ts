import {
    Column,
    Entity,
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

    @Column({ type: 'int4' })
    @ManyToOne(type => Point, point => point.image) 
    point: Point;
}
