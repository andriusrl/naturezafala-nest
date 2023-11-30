import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUser1701347023068 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        UPDATE public."user"
            SET cpf='00100100121'
            WHERE id=1;
        UPDATE public."user"
            SET cpf='00100100122'
            WHERE id=2;
        UPDATE public."user"
            SET cpf='00100100123'
            WHERE id=3;
        UPDATE public."user"
            SET cpf='00100100124'
            WHERE id=4;
        UPDATE public."user"
            SET cpf='00100100125'
            WHERE id=5;

        ALTER TABLE public."user" ADD CONSTRAINT user_un_cpf UNIQUE (cpf);
        ALTER TABLE public."user" ADD CONSTRAINT user_un_email UNIQUE (email);    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE public."user" DROP CONSTRAINT user_un_cpf;
        ALTER TABLE public."user" DROP CONSTRAINT user_un_email;
    `);
  }
}
