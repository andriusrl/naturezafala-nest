import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateSequencePoint1698757891370 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE SEQUENCE public.point_id_seq
            INCREMENT BY 1
            MINVALUE 1
            MAXVALUE 9223372036854775807
            START 1
            CACHE 1
            NO CYCLE;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            DROP SEQUENCE public.point_id_seq;
        `);
    }

}
