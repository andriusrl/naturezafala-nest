import { MigrationInterface, QueryRunner } from "typeorm"

export class AlterTableUser1700162596957 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        CREATE SEQUENCE public.user_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;

        ALTER TABLE public."user" ALTER COLUMN id SET DEFAULT nextval('user_id_seq'::regclass); 
        ALTER SEQUENCE public.user_id_seq
	        START 1
	        RESTART 4;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            
        `)
    }

}
