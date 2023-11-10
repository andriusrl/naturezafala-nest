import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTablePoint1699643410705 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point ADD pollution_type int4 NOT NULL;
        `)
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point DROP COLUMN pollution_type;
        `)
    }

}
