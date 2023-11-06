import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableAccess1699276984636 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE public."access" (
                id bigserial NOT NULL,
                "user" int4 NOT NULL,
                "action" int4 NOT NULL,
                description varchar(255) NULL,
                "date" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
            );    
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            drop table public.access;
        `)
    }

}
