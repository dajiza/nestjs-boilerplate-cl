import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTimeblockReasonToVarchar1776200000000 implements MigrationInterface {
  name = 'AlterTimeblockReasonToVarchar1776200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Change reason column from jsonb to varchar, converting existing data
    await queryRunner.query(`
      ALTER TABLE "timeblock"
      ALTER COLUMN "reason" TYPE varchar(50)
      USING (CASE
        WHEN reason IS NULL THEN NULL
        WHEN reason::text = 'null' THEN NULL
        WHEN reason::text ~ '^\s*".+"\s*$' THEN (reason::text)::jsonb #>> '{}'
        ELSE reason::text
      END)
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN "timeblock"."reason" IS 'The reason for the time being blocked (BUSINESS | PERSONAL)'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "timeblock"
      ALTER COLUMN "reason" TYPE jsonb
      USING (CASE
        WHEN reason IS NULL THEN NULL
        ELSE to_jsonb(reason)
      END)
    `);
    await queryRunner.query(`
      COMMENT ON COLUMN "timeblock"."reason" IS 'The reason for the time being blocked'
    `);
  }
}
