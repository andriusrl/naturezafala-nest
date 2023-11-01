import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableImage1698849354846 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE public.image (
                id bigserial NOT NULL,
                url varchar(255) NOT NULL,
                point int4 NOT NULL,
                CONSTRAINT image_fk FOREIGN KEY (point) REFERENCES public.point(id)
            );
        `)
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            drop table public.image
        `)
    }

}
