import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableComment1698844602235 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."comment" ADD CONSTRAINT comment_fk FOREIGN KEY ("user") REFERENCES public."user"(id);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."comment" DROP CONSTRAINT comment_fk;
        `)
    }

}
