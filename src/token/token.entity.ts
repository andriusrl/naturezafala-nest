import {
    Column,
    Entity,
    PrimaryColumn,
} from 'typeorm';

@Entity('token', { schema: 'public' })
export class TokenEntity {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    id: string;

    @Column({ type: 'varchar', length: 255 })
    hash: string;

    @Column({ type: 'int4' })

    user: number;
}
