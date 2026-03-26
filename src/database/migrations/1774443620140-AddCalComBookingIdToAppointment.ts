import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCalComBookingIdToAppointment1774443620140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "appointment"
            ADD COLUMN "calComBookingId" character varying(255) NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "appointment"
            DROP COLUMN "calComBookingId"
        `);
  }
}
