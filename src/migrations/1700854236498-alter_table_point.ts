import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTablePoint1700854236498 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE public.point ADD status boolean NOT NULL DEFAULT false;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE public.point DROP COLUMN status;
    `);
  }
}
