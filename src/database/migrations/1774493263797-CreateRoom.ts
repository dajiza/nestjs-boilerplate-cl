import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoom1774493263797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "room" (
                "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" VARCHAR(255) NOT NULL,
                "serviceId" VARCHAR(255) NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_room_service" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE SET NULL
            )
        `);

    await queryRunner.query(`CREATE INDEX "IDX_room_serviceId" ON "room" ("serviceId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_room_serviceId"`);
    await queryRunner.query(`DROP TABLE "room"`);
  }
}
