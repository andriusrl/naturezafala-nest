import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableComment1698845128979 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."comment" ADD CONSTRAINT comment_point_fk FOREIGN KEY (point) REFERENCES public.point(id);
        `)
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE public."comment" DROP CONSTRAINT comment_point_fk;
        `)
    }
}
