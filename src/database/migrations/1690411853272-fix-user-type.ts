import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserType1690411853272 implements MigrationInterface {
    name = 'FixUserType1690411853272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lat"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lat" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lng" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lng"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lng" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lat"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lat" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
