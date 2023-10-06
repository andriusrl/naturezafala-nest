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
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
