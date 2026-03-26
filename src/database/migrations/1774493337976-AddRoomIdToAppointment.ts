import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoomIdToAppointment1774493337976 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "appointment"
            ADD COLUMN "roomId" UUID NULL
        `);

    await queryRunner.query(`CREATE INDEX "IDX_appointment_roomId" ON "appointment" ("roomId")`);

    await queryRunner.query(`
            ALTER TABLE "appointment"
            ADD CONSTRAINT "FK_appointment_room"
            FOREIGN KEY ("roomId") REFERENCES "room"("id")
            ON DELETE SET NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_appointment_room"`);
    await queryRunner.query(`DROP INDEX "IDX_appointment_roomId"`);
    await queryRunner.query(`ALTER TABLE "appointment" DROP COLUMN "roomId"`);
  }
}
