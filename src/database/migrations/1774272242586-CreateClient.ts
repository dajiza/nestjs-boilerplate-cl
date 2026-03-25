import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClient1774272242586 implements MigrationInterface {
  name = 'CreateClient1774272242586';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "client" (
        "id" character varying(255) NOT NULL,
        "active" boolean NOT NULL,
        "appointmentCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL,
        "creditCardsOnFile" jsonb,
        "currentAccountBalance" integer NOT NULL DEFAULT 0,
        "currentAccountUpdatedAt" TIMESTAMP,
        "custom" jsonb,
        "customFields" jsonb,
        "keys" text array,
        "dob" date,
        "email" character varying(255),
        "externalId" character varying(255),
        "firstName" character varying(255),
        "hasCardOnFile" boolean NOT NULL DEFAULT false,
        "lastName" character varying(255),
        "marketingSettings" jsonb,
        "mergedIntoClientId" character varying(255),
        "mobilePhone" character varying(50),
        "name" character varying(255),
        "notes" jsonb,
        "primaryLocation" jsonb,
        "pronoun" character varying(50),
        "reminderSettings" jsonb,
        "schedulingAlert" text,
        "tags" jsonb,
        "updatedAt" TIMESTAMP NOT NULL,
        CONSTRAINT "PK_client_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_client_email" ON "client" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_client_mobilePhone" ON "client" ("mobilePhone")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_client_mobilePhone"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_client_email"`);
    await queryRunner.query(`DROP TABLE "client"`);
  }
}
