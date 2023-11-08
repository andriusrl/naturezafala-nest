import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../image/entities/image.entity';
import { Comment } from '../../comment/entities/comment.entity';


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

    @OneToMany(type => Image, image => image.point) image: Image[]; 
    
    @OneToMany(type => Image, image => image.point) comment: Comment[];  
}
