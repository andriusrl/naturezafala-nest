import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableComment1698847598491 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."comment" ADD "date" timestamp NOT NULL;
        `)
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."comment" DROP COLUMN "date";
        `)
    }

}
