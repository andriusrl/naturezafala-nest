import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTablePollutionType1699625870858 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE public.pollution_type (
                id bigserial NOT NULL,
                "name" varchar(100) NOT NULL,
                description text NULL,
                CONSTRAINT pollution_type_pk PRIMARY KEY (id)
            );
        `)
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            drop table public.pollution_type;
        `)
    }

}
