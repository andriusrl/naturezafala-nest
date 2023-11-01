import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTablePoint1698842307866 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point ALTER COLUMN latitude TYPE float8 USING latitude::float8;
            ALTER TABLE public.point ALTER COLUMN longitude TYPE float8 USING longitude::float8;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point ALTER COLUMN latitude TYPE int4 USING latitude::int4;
            ALTER TABLE public.point ALTER COLUMN longitude TYPE int4 USING longitude::int4;
        `)
    }
}
