import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableUser1700140694356 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."user" ADD status boolean NOT NULL;          
            
            INSERT INTO public."user"
                (id, "name", birth_date, fone, cpf, email, "password", "type", "status")
                VALUES(1, 'Andrius Administrador', '1993-12-23 00:00:00.000', '6799999999', '00100100101', 'andrius.administrador@email.com', '221133', 1, true);
            INSERT INTO public."user"
                (id, "name", birth_date, fone, cpf, email, "password", "type", "status")
                VALUES(2, 'Andrius Moderador', '1993-12-23 00:00:00.000', '6799999999', '00100100101', 'andrius.moderador@email.com', '221133', 2, true);
            INSERT INTO public."user"
                (id, "name", birth_date, fone, cpf, email, "password", "type", "status")
                VALUES(3, 'Andrius Usuário', '1993-12-23 00:00:00.000', '6799999999', '00100100101', 'andrius@email.com', '221133', 1, true);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
    `)
    }

}
