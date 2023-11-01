import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableToken1698867767149 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."token" ADD CONSTRAINT token_pk PRIMARY KEY (id);
            ALTER TABLE public."token" ADD CONSTRAINT token_fk FOREIGN KEY ("user") REFERENCES public."user"(id);
        `)
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."token" DROP CONSTRAINT token_pk;
            ALTER TABLE public."token" DROP CONSTRAINT token_fk;
        `)
    }

}
