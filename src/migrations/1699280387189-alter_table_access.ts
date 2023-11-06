import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableAccess1699280387189 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."access" ADD ip varchar(60) NULL;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."access" DROP COLUMN ip;
        `)
    }
}
