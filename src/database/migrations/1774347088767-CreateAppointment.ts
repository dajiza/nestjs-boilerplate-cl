import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppointment1774347088767 implements MigrationInterface {
  name = 'CreateAppointment1774347088767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "appointment" (
        "id" character varying(255) NOT NULL,
        "startAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL,
        "cancelled" boolean NOT NULL,
        "staffId" character varying(255) NOT NULL,
        "appointmentServiceOptions" jsonb,
        "appointmentServiceResources" jsonb,
        "appointmentServices" jsonb,
        "bookedByType" character varying(50),
        "calendarLinks" jsonb,
        "cancellation" jsonb,
        "client" jsonb,
        "clientId" character varying(255),
        "clientMessage" text,
        "custom" jsonb,
        "customFields" jsonb,
        "keys" text array,
        "duration" integer,
        "endAt" TIMESTAMP,
        "isGroupedAppointment" boolean,
        "isRecurring" boolean,
        "isRemote" boolean,
        "location" jsonb,
        "locationId" character varying(255),
        "manageUrl" character varying(500),
        "notes" text,
        "notifyClientCancel" boolean,
        "notifyClientCreate" boolean,
        "orderId" character varying(255),
        "pendingFormCount" integer,
        "rating" jsonb,
        "remotePlatforms" jsonb,
        "state" character varying(50),
        "tags" jsonb,
        CONSTRAINT "PK_appointment_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_appointment_startAt" ON "appointment" ("startAt")`);
    await queryRunner.query(`CREATE INDEX "IDX_appointment_staffId" ON "appointment" ("staffId")`);
    await queryRunner.query(`CREATE INDEX "IDX_appointment_clientId" ON "appointment" ("clientId")`);
    await queryRunner.query(`CREATE INDEX "IDX_appointment_locationId" ON "appointment" ("locationId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_appointment_locationId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_appointment_clientId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_appointment_staffId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_appointment_startAt"`);
    await queryRunner.query(`DROP TABLE "appointment"`);
  }
}
