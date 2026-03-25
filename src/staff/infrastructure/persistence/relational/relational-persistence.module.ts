import { Module } from '@nestjs/common';
import { StaffRepository } from '../staff.repository';
import { StaffRelationalRepository } from './repositories/staff.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffEntity } from './entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffEntity])],
  providers: [
    {
      provide: StaffRepository,
      useClass: StaffRelationalRepository,
    },
  ],
  exports: [StaffRepository],
})
export class RelationalStaffPersistenceModule {}
