import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableComment1698843170911 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE public."comment" (
                id bigserial NOT NULL,
                "comment" text NOT NULL,
                point int4 NOT NULL,
                "user" int4 NOT NULL,
                CONSTRAINT comment_pk PRIMARY KEY (id)
            );   
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            DROP TABLE public."comment";
        `)
    }
}
