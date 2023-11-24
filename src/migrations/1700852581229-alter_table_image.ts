import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableImage1700852581229 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE public.image ADD CONSTRAINT image_pk PRIMARY KEY (id);
        ALTER TABLE public.image ADD status bool NOT NULL DEFAULT false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE public.image DROP CONSTRAINT image_pk;
        ALTER TABLE public.image DROP COLUMN status;
    `);
  }
}
