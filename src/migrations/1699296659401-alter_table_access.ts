import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableAccess1699296659401 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."access" ADD CONSTRAINT access_pk PRIMARY KEY (id);
            ALTER TABLE public."access" ADD CONSTRAINT access_fk FOREIGN KEY ("user") REFERENCES public."user"(id);         
        `)
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."access" DROP CONSTRAINT access_fk;
            ALTER TABLE public."access" DROP CONSTRAINT access_pk;
        `)
    }
}
