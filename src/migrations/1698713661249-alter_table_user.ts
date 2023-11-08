import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableUser1698713661249 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."user" ADD CONSTRAINT user_pk PRIMARY KEY (id);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."user" DROP CONSTRAINT user_pk;
        `)
    }

}