import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertTablePoint1699578217630 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.211874,-54.828174);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.213652,-54.829611);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.213652,-54.829611);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.217721,-54.83458);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.211296,-54.831716);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.211874,-54.828174); 
        `)
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            DELETE FROM public.point
                WHERE id=4;
            DELETE FROM public.point
                WHERE id=5;
            DELETE FROM public.point
                WHERE id=6;
            DELETE FROM public.point
                WHERE id=7;
            DELETE FROM public.point
                WHERE id=8;
            DELETE FROM public.point
                WHERE id=9;
        `)
    }
}
