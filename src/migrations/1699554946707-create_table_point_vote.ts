import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTablePointVote1699554946707 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TABLE public.point_vote (
                point int4 NOT NULL,
                "user" int4 NOT NULL,
                vote int4 NOT NULL,
                CONSTRAINT point_vote_pk PRIMARY KEY (point,"user"),
                CONSTRAINT point_vote_fk FOREIGN KEY ("user") REFERENCES public."user"(id),
                CONSTRAINT point_vote_fk_1 FOREIGN KEY (point) REFERENCES public.point(id)
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            drop table public.point_vote;
        `)
    }
}
