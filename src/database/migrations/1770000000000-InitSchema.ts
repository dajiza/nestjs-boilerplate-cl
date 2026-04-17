import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 初始化数据库 — 合并所有历史 migration 为单一文件
 * 包含 17 张表的最终状态
 */
export class InitSchema1770000000000 implements MigrationInterface {
  name = 'InitSchema1770000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // ========================================
    // 基础表（无外键依赖）
    // ========================================

    // role
    await queryRunner.query(`
      CREATE TABLE "role" (
        "id" serial NOT NULL PRIMARY KEY,
        "name" character varying NOT NULL
      )
    `);

    // status
    await queryRunner.query(`
      CREATE TABLE "status" (
        "id" serial NOT NULL PRIMARY KEY,
        "name" character varying NOT NULL
      )
    `);

    // file
    await queryRunner.query(`
      CREATE TABLE "file" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        "path" character varying NOT NULL
      )
    `);

    // business
    await queryRunner.query(`
      CREATE TABLE "business" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "name" character varying(255) NOT NULL,
        "address" jsonb NOT NULL,
        "allowLoginWithMultipleClients" boolean,
        "billingContactEmail" character varying(255),
        "custom" jsonb NOT NULL,
        "customBookingUrl" character varying(255),
        "customFields" jsonb NOT NULL,
        "phone" character varying(50),
        "showLocationHours" boolean NOT NULL,
        "tz" character varying(100) NOT NULL,
        "website" character varying(255)
      )
    `);

    // location
    await queryRunner.query(`
      CREATE TABLE "location" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "name" character varying(255) NOT NULL,
        "address" jsonb NOT NULL,
        "arrivalInstructions" character varying(255),
        "billingContactEmail" character varying(255),
        "businessName" character varying(255) NOT NULL DEFAULT '',
        "contactEmail" character varying(255),
        "coordinates" jsonb,
        "externalId" character varying(255),
        "googlePlaceId" character varying(255),
        "hours" jsonb,
        "isRemote" boolean NOT NULL DEFAULT false,
        "paymentOptions" jsonb NOT NULL,
        "phone" character varying(50),
        "showLocationHours" boolean NOT NULL DEFAULT false,
        "tz" character varying(100) NOT NULL DEFAULT '',
        "website" character varying(255)
      )
    `);

    // service_category
    await queryRunner.query(`
      CREATE TABLE "service_category" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "name" character varying(255) NOT NULL,
        "active" boolean NOT NULL DEFAULT true,
        "createdAt" timestamp NOT NULL,
        "sortPath" jsonb NOT NULL,
        "services" jsonb,
        "updatedAt" timestamp NOT NULL
      )
    `);

    // service
    await queryRunner.query(`
      CREATE TABLE "service" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "name" character varying(255) NOT NULL,
        "active" boolean NOT NULL,
        "addon" boolean NOT NULL,
        "addons" jsonb NOT NULL,
        "category" jsonb NOT NULL,
        "categoryId" character varying(255) NOT NULL,
        "createdAt" timestamp NOT NULL,
        "custom" jsonb NOT NULL,
        "customFields" jsonb NOT NULL,
        "defaultDuration" integer NOT NULL,
        "defaultPrice" integer NOT NULL,
        "description" text,
        "externalId" character varying(255),
        "serviceOptionGroups" jsonb NOT NULL,
        "serviceOverrides" jsonb NOT NULL,
        "serviceStatus" jsonb NOT NULL,
        "sortPath" jsonb NOT NULL,
        "updatedAt" timestamp NOT NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_service_categoryId" ON "service" ("categoryId")`);

    // staff_role
    await queryRunner.query(`
      CREATE TABLE "staff_role" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "name" character varying(255) NOT NULL
      )
    `);

    // staff
    await queryRunner.query(`
      CREATE TABLE "staff" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "name" character varying(255) NOT NULL,
        "active" boolean,
        "alternateId" character varying(255),
        "appRole" jsonb NOT NULL,
        "appRoleId" character varying(255),
        "avatar" character varying(500),
        "bio" text,
        "createdAt" timestamp NOT NULL,
        "displayName" character varying(255) NOT NULL,
        "email" character varying(255),
        "enabledForFutureLocations" boolean NOT NULL,
        "externalId" character varying(255),
        "externalNickname" character varying(255),
        "externallyBookable" boolean,
        "firstName" character varying(255) NOT NULL,
        "lastName" character varying(255),
        "locationAbilities" jsonb NOT NULL,
        "locations" jsonb,
        "mobilePhone" character varying(50),
        "nickname" character varying(255),
        "role" jsonb NOT NULL,
        "staffRoleId" character varying(255) NOT NULL,
        "suspended" boolean,
        "updatedAt" timestamp NOT NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_staff_email" ON "staff" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_staff_mobilePhone" ON "staff" ("mobilePhone")`);

    // client
    await queryRunner.query(`
      CREATE TABLE "client" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "active" boolean NOT NULL,
        "appointmentCount" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL,
        "creditCardsOnFile" jsonb NOT NULL,
        "currentAccountBalance" integer NOT NULL DEFAULT 0,
        "currentAccountUpdatedAt" timestamp,
        "custom" jsonb,
        "customFields" jsonb NOT NULL,
        "dob" date,
        "email" character varying(255),
        "externalId" character varying(255),
        "firstName" character varying(255),
        "hasCardOnFile" boolean NOT NULL DEFAULT false,
        "lastName" character varying(255),
        "marketingSettings" jsonb NOT NULL,
        "mergedIntoClientId" character varying(255),
        "mobilePhone" character varying(50),
        "name" character varying(255),
        "notes" jsonb NOT NULL,
        "primaryLocation" jsonb,
        "pronoun" character varying(50),
        "reminderSettings" jsonb NOT NULL,
        "schedulingAlert" text,
        "tags" jsonb NOT NULL,
        "updatedAt" timestamp NOT NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_client_email" ON "client" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_client_mobilePhone" ON "client" ("mobilePhone")`);

    // appointment
    await queryRunner.query(`
      CREATE TABLE "appointment" (
        "id" character varying(255) NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
        "startAt" timestamp NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "cancelled" boolean NOT NULL,
        "appointmentServiceOptions" jsonb NOT NULL,
        "appointmentServiceResources" jsonb NOT NULL,
        "appointmentServices" jsonb NOT NULL,
        "bookedByType" character varying(50) NOT NULL,
        "calendarLinks" jsonb NOT NULL,
        "cancellation" jsonb,
        "client" jsonb NOT NULL,
        "clientId" character varying(255) NOT NULL,
        "clientMessage" text,
        "custom" jsonb,
        "customFields" jsonb NOT NULL,
        "duration" integer NOT NULL,
        "endAt" timestamp NOT NULL,
        "isGroupedAppointment" boolean NOT NULL,
        "isRecurring" boolean NOT NULL,
        "isRemote" boolean NOT NULL,
        "location" jsonb NOT NULL,
        "locationId" character varying(255) NOT NULL,
        "manageUrl" text NOT NULL,
        "notes" text,
        "notifyClientCancel" boolean NOT NULL,
        "notifyClientCreate" boolean NOT NULL,
        "orderId" character varying(255),
        "pendingFormCount" integer NOT NULL,
        "rating" jsonb,
        "remotePlatforms" jsonb NOT NULL,
        "state" character varying(50) NOT NULL,
        "tags" jsonb NOT NULL
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_appointment_startAt" ON "appointment" ("startAt")`);
    await queryRunner.query(`CREATE INDEX "IDX_appointment_clientId" ON "appointment" ("clientId")`);
    await queryRunner.query(`CREATE INDEX "IDX_appointment_locationId" ON "appointment" ("locationId")`);

    // shift
    await queryRunner.query(`
      CREATE TABLE "shift" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "available" boolean NOT NULL DEFAULT true,
        "date" date NOT NULL DEFAULT CURRENT_DATE,
        "endTime" time NOT NULL DEFAULT '00:00:00',
        "location" jsonb NOT NULL,
        "locationId" character varying(255),
        "recurrence" jsonb,
        "staff" jsonb NOT NULL,
        "staffId" character varying(255),
        "startTime" time NOT NULL DEFAULT '00:00:00',
        "unavailableReason" character varying(255)
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_shift_staffId" ON "shift" ("staffId")`);
    await queryRunner.query(`CREATE INDEX "IDX_shift_locationId" ON "shift" ("locationId")`);

    // timeblock
    await queryRunner.query(`
      CREATE TABLE "timeblock" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "cancelled" boolean,
        "duration" integer NOT NULL DEFAULT 0,
        "endAt" timestamp NOT NULL,
        "location" jsonb NOT NULL,
        "reason" jsonb,
        "staff" jsonb NOT NULL,
        "staffId" character varying(255) NOT NULL,
        "startAt" timestamp NOT NULL,
        "title" character varying(255)
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_timeblock_staffId" ON "timeblock" ("staffId")`);

    // ========================================
    // 依赖 user 的表
    // ========================================

    // user
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" serial NOT NULL PRIMARY KEY,
        "email" character varying,
        "password" character varying,
        "provider" character varying NOT NULL DEFAULT 'email',
        "socialId" character varying,
        "firstName" character varying,
        "lastName" character varying,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        "deletedAt" timestamp,
        "photoId" uuid,
        "roleId" integer,
        "statusId" integer,
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "REL_user_photoId" UNIQUE ("photoId")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_user_firstName" ON "user" ("firstName")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_lastName" ON "user" ("lastName")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_socialId" ON "user" ("socialId")`);

    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_user_photo" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_user_role" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE SET NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_user_status" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE SET NULL`,
    );

    // session
    await queryRunner.query(`
      CREATE TABLE "session" (
        "id" serial NOT NULL PRIMARY KEY,
        "hash" character varying NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        "deletedAt" timestamp,
        "userId" integer
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_session_userId" ON "session" ("userId")`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_session_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`,
    );

    // booking_session
    await queryRunner.query(`
      CREATE TABLE "booking_session" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "locationId" character varying(255) NOT NULL,
        "clientId" character varying(255),
        "state" character varying(50) NOT NULL DEFAULT 'DRAFT',
        "services" jsonb,
        "startAt" timestamp,
        "notes" text,
        "clientMessage" text,
        "expiresAt" timestamp NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_booking_session_locationId" ON "booking_session" ("locationId")`);
    await queryRunner.query(`CREATE INDEX "IDX_booking_session_expiresAt" ON "booking_session" ("expiresAt")`);

    // webhook_event
    await queryRunner.query(`
      CREATE TABLE "webhook_event" (
        "id" character varying(255) NOT NULL PRIMARY KEY,
        "eventType" character varying(255) NOT NULL,
        "resource" character varying(255),
        "event" character varying(255),
        "businessId" character varying(255),
        "webhookId" character varying(255),
        "payload" jsonb NOT NULL,
        "webhookTimestamp" timestamptz,
        "processed" boolean NOT NULL DEFAULT false,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_webhook_event_eventType" ON "webhook_event" ("eventType")`);
    await queryRunner.query(`CREATE INDEX "IDX_webhook_event_processed" ON "webhook_event" ("processed")`);
    await queryRunner.query(`CREATE INDEX "IDX_webhook_event_resource" ON "webhook_event" ("resource")`);
    await queryRunner.query(`CREATE INDEX "IDX_webhook_event_webhookTimestamp" ON "webhook_event" ("webhookTimestamp")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 按依赖关系倒序删除
    await queryRunner.query(`DROP TABLE IF EXISTS "webhook_event"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "booking_session"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "session"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "timeblock"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "shift"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "appointment"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "client"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "staff"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "staff_role"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "service"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "service_category"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "location"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "business"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "file"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "status"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "role"`);
  }
}
