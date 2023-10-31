import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTablePoint1698757701045 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point ADD CONSTRAINT point_fk FOREIGN KEY ("user") REFERENCES public."user"(id);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point DROP CONSTRAINT point_fk;
        `);
    }

}
