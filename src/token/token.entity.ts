import { User } from 'src/models/public/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';

@Entity('token', { schema: 'public' })
export class TokenEntity {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    id: string;

    @Column({ type: 'varchar', length: 255 })
    hash: string;

    @Column({ type: 'int4' })
    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user'})
    user: number;
}
