import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStaff1774349543655 implements MigrationInterface {
  name = 'CreateStaff1774349543655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "staff" (
        "id" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "name" character varying(255) NOT NULL,
        "mobilePhone" character varying(50) NOT NULL,
        "active" boolean NOT NULL,
        "displayName" character varying(255),
        "firstName" character varying(255),
        "lastName" character varying(255),
        "createdAt" TIMESTAMP,
        "updatedAt" TIMESTAMP,
        "alternateId" character varying(255),
        "appRole" jsonb,
        "appRoleId" character varying(255),
        "avatar" character varying(500),
        "bio" text,
        "enabledForFutureLocations" boolean,
        "externalId" character varying(255),
        "externalNickname" character varying(255),
        "externallyBookable" boolean,
        "locationAbilities" jsonb,
        "locationId" character varying(255),
        "locations" jsonb,
        "nickname" character varying(255),
        "role" jsonb,
        "staffRoleId" character varying(255),
        "suspended" boolean,
        CONSTRAINT "PK_staff_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_staff_email" ON "staff" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_staff_mobilePhone" ON "staff" ("mobilePhone")`);
    await queryRunner.query(`CREATE INDEX "IDX_staff_locationId" ON "staff" ("locationId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_staff_locationId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_staff_mobilePhone"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_staff_email"`);
    await queryRunner.query(`DROP TABLE "staff"`);
  }
}
