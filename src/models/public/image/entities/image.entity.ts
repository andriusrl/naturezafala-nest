import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('image', { schema: 'public' })
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    url: string;

    @Column({ type: 'int4' })
    point: number;
}
