import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSequencePoint1698757891370 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public.point DROP CONSTRAINT point_pk;
            ALTER TABLE public.point DROP COLUMN id;
            ALTER TABLE public.point ADD id bigint NOT NULL DEFAULT nextval('point_id_seq'::regclass);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            DROP SEQUENCE public.point_id_seq;
        `);
    }

}
