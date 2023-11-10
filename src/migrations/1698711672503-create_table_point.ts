import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTablePoint1698711672503 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE public.point (
                id _int4 NOT NULL,
                name varchar(255) NOT NULL,
                description text NOT NULL,
                "location" varchar(255) NOT NULL,
                "date" timestamp NOT NULL,
                "user" int4 NOT NULL,
                CONSTRAINT point_pk PRIMARY KEY (id)
            );        
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            drop table public.point;
        `)
    }

}
