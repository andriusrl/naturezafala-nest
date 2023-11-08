import Access from 'src/access/entities/access.entity';
import { TokenEntity } from 'src/token/token.entity';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user', { schema: 'public' })
export class User {
    @PrimaryGeneratedColumn({ type: 'int8' })
    public id?: number;

    @Column({ type: 'varchar', length: 255 })
    public name?: string;

    @Column({ type: 'timestamp' })
    public birth_date?: Date;

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
}
