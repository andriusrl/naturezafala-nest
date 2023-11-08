import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1696620917168 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public."user" (
                id int4 NOT NULL,
                name varchar(255) NOT NULL,
                birth_date timestamp NOT NULL,
                fone varchar(25) NULL,
                cpf varchar(11) NOT NULL,
                email varchar(255) NOT NULL,
                "password" varchar(30) NOT NULL,
                "type" int4 NOT NULL
            );

            CREATE SEQUENCE public.user_id_seq
              AS integer
              START WITH 1
              INCREMENT BY 1
              NO MINVALUE
              NO MAXVALUE
              CACHE 1;

            ALTER SEQUENCE public.user_id_seq OWNED BY public.user.id;
            
            ALTER TABLE ONLY public.user ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        drop table public.user
    `)
  }
}
