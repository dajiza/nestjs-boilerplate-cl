import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateService1774351253098 implements MigrationInterface {
  name = 'CreateService1774351253098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "service" (
        "id" character varying(255) NOT NULL,
        "name" character varying(255) NOT NULL,
        "active" boolean NOT NULL,
        "addon" boolean NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL,
        "defaultDuration" integer NOT NULL,
        "defaultPrice" integer NOT NULL,
        "locationId" character varying(255),
        "categoryId" character varying(255),
        "custom" jsonb,
        "customFields" jsonb,
        "keys" text array,
        "addons" jsonb,
        "category" jsonb,
        "description" text,
        "externalId" character varying(255),
        "serviceOptionGroups" jsonb,
        "serviceOverrides" jsonb,
        "serviceStatus" jsonb,
        "sortPath" jsonb,
        CONSTRAINT "PK_service_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_service_locationId" ON "service" ("locationId")`);
    await queryRunner.query(`CREATE INDEX "IDX_service_categoryId" ON "service" ("categoryId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_service_categoryId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_service_locationId"`);
    await queryRunner.query(`DROP TABLE "service"`);
  }
}
