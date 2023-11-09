import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTablePointVote1699556222684 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point_vote ALTER COLUMN vote TYPE boolean USING vote::boolean;
        `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point_vote ALTER COLUMN vote TYPE int4 USING vote::int4;
        `);
    }
}