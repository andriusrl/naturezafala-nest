import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableUser1700140694356 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            DELETE FROM public."user"
                WHERE id=2;
            DELETE FROM public."user"
                WHERE id=1;
            DELETE FROM public."user"
                WHERE id=3;

            ALTER TABLE public."user" ADD status boolean NOT NULL;    
                            
            INSERT INTO public."user"
                (id, "name", birth_date, fone, cpf, email, "password", "type", "status")
                VALUES(2, 'andrius2', '1993-12-23 00:00:00.000', '6799999999', '00100100101', 'andriusrl2', '221133', 2, true);
            INSERT INTO public."user"
                (id, "name", birth_date, fone, cpf, email, "password", "type", "status")
                VALUES(1, 'andrius', '1993-12-23 00:00:00.000', '6799999999', '00100100101', 'andriusrl', '221133', 1, true);
            INSERT INTO public."user"
                (id, "name", birth_date, fone, cpf, email, "password", "type", "status")
                VALUES(3, 'andrius3', '1993-12-23 00:00:00.000', '6799999999', '00100100101', 'andriusrl3', '221133', 1, true);


        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
    `)
    }

}
