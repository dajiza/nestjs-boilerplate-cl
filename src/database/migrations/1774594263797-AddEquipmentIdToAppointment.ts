import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddEquipmentIdToAppointment1774594263797 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'appointment',
      new TableColumn({
        name: 'equipmentId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createIndex(
      'appointment',
      new TableIndex({
        name: 'IDX_appointment_equipmentId',
        columnNames: ['equipmentId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('appointment', 'IDX_appointment_equipmentId');
    await queryRunner.dropColumn('appointment', 'equipmentId');
  }
}
