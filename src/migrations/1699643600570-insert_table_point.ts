import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertTablePoint1699643600570 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            INSERT INTO public."user" ("name",birth_date,fone,cpf,email,"password","type")
	            VALUES ('Andrius','2023-11-09 00:00:00.000','67984789245','01147898741','andriusrl','221133',1);

            INSERT INTO public."user" ("name",birth_date,fone,cpf,email,"password","type")
	            VALUES ('Andrius 2','2023-11-09 00:00:00.000','67984789245','01147898741','andriusrl2','221133',1);

            INSERT INTO public."user" ("name",birth_date,fone,cpf,email,"password","type")
	            VALUES ('Andrius 3','2023-11-09 00:00:00.000','67984789245','01147898741','andriusrl3','221133',1);
            
            INSERT INTO public."user" ("name",birth_date,fone,cpf,email,"password","type")
	            VALUES ('Andrius','2023-11-09 00:00:00.000','67984789245','01147898741','andriusrl','221133',1);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude,pollution_type)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.211874,-54.828174, 3);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude,pollution_type)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.213652,-54.829611, 3);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude,pollution_type)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.213652,-54.829611, 3);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude,pollution_type)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.217721,-54.83458, 3);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude,pollution_type)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.211296,-54.831716, 3);
            INSERT INTO public.point ("name",description,"date","user",latitude,longitude,pollution_type)
                VALUES ('Lixo em terreno','muito lixo em terreno podendo conter foco de dengue (apenas teste, esse foco não existe)','2023-11-09 00:00:00.000',1,-22.211874,-54.828174, 3); 
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
