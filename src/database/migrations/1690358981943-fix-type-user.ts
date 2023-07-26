import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTypeUser1690358981943 implements MigrationInterface {
    name = 'FixTypeUser1690358981943'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

}
