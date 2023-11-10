import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertTablePollutionType1699635347347 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        INSERT INTO public.pollution_type ("name")
            VALUES ('Poluição atmosférica');
        INSERT INTO public.pollution_type ("name")
            VALUES ('Poluição hídrica');
        INSERT INTO public.pollution_type ("name")
            VALUES ('Poluição do solo');
        INSERT INTO public.pollution_type ("name")
            VALUES ('Poluição térmica');
        INSERT INTO public.pollution_type ("name")
            VALUES ('Poluição sonora e visual');
        INSERT INTO public.pollution_type ("name")
            VALUES ('Poluição luminosa');
        INSERT INTO public.pollution_type ("name")
            VALUES ('Poluição radioativa');
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        DELETE FROM public.pollution_type
            WHERE id=1;
        DELETE FROM public.pollution_type
            WHERE id=2;
        DELETE FROM public.pollution_type
            WHERE id=3;
        DELETE FROM public.pollution_type
            WHERE id=4;
        DELETE FROM public.pollution_type
            WHERE id=5;
        DELETE FROM public.pollution_type
            WHERE id=6;
        DELETE FROM public.pollution_type
            WHERE id=7;
            `)
    }

}
