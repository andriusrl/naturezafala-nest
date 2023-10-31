import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTablePoint1698759985893 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point DROP COLUMN "location";
            ALTER TABLE public.point ADD latitude int4 NOT NULL;
            ALTER TABLE public.point ADD longitude int4 NOT NULL;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point DROP COLUMN latitude;
            ALTER TABLE public.point DROP COLUMN longitude;
            ALTER TABLE public.point ADD "location" varchar(255) NOT NULL;
        `)
    }

}
