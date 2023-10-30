import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableToken1697597048552 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        CREATE TABLE public."token" (
            id varchar(255) NOT NULL,
            hash varchar(255) NOT NULL,
            "user" int4 NOT NULL
        );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            drop table public.token
        `)
    }

}
