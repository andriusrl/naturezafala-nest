import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('access', { schema: 'public' })
export default class Access {
  @PrimaryColumn({
    name: 'id',
    primary: true,
    type: 'integer',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  id: number;

  @Column({
    type: 'int4',
    nullable: false,
  })
  user_id: number;

  @Column({
    type: 'int4',
    nullable: false,
  })
  action: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 60,
  })
  ip: string;

  @Column({
    type: 'timestamp',
  })
  date: Date;
}
