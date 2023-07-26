import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1690351085033 implements MigrationInterface {
    name = 'Init1690351085033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(150) NOT NULL, "password" character varying NOT NULL, "avatar" text, "name" character varying(150) NOT NULL, "street" text NOT NULL, "lat" text NOT NULL, "lng" text NOT NULL, "countryId" integer NOT NULL, "districtId" integer NOT NULL, "wandId" integer NOT NULL, "phone" character varying(30) NOT NULL, "gender" boolean NOT NULL, "birthday" text NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "oauth" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "accessToken" text, "status" integer, CONSTRAINT "REL_639b5775145fb76279ffa6f0ee" UNIQUE ("userId"), CONSTRAINT "PK_a957b894e50eb16b969c0640a8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "conversationId" integer NOT NULL, "message" text NOT NULL, "status" integer, "userId" integer NOT NULL, CONSTRAINT "REL_446251f8ceb2132af01b68eb59" UNIQUE ("userId"), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversation" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "name" text, "avatar" text NOT NULL DEFAULT 'https://cdn-icons-png.flaticon.com/512/666/666201.png', "lastMessageId" bigint, "type" boolean NOT NULL, "members" integer array NOT NULL, "background" text NOT NULL DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReLyRAfB8rBKl8AsfBciSq7OucaCorv8TP8iBPyd7a&s', "status" integer, "lastActivity" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "oauth" ADD CONSTRAINT "FK_639b5775145fb76279ffa6f0ee5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`);
        await queryRunner.query(`ALTER TABLE "oauth" DROP CONSTRAINT "FK_639b5775145fb76279ffa6f0ee5"`);
        await queryRunner.query(`DROP TABLE "conversation"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "oauth"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
