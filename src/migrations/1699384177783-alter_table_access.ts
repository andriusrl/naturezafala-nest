import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableAccess1699384177783 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."access" RENAME COLUMN "user" TO user_id;
        `)
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."access" RENAME COLUMN user_id TO "user";
        `)
    }

}
