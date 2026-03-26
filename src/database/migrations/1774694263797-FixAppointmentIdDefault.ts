import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixAppointmentIdDefault1774694263797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure uuid-ossp extension is available
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Fix appointment table id default
    await queryRunner.query(`
      ALTER TABLE "appointment"
      ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()
    `);

    // Fix room table id default
    await queryRunner.query(`
      ALTER TABLE "room"
      ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()
    `);

    // Fix equipment table id default
    await queryRunner.query(`
      ALTER TABLE "equipment"
      ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointment" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "equipment" ALTER COLUMN "id" DROP DEFAULT`);
  }
}
