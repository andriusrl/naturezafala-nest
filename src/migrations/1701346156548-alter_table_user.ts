import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUser1701346156548 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE public."access" ALTER COLUMN user_id DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE public."access" ALTER COLUMN user_id SET NOT NULL;
    `);
  }
}
