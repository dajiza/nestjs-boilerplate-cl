import { Module } from '@nestjs/common';
import { StaffRoleRepository } from '../staff-role.repository';
import { StaffRoleRelationalRepository } from './repositories/staff-role.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffRoleEntity } from './entities/staff-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffRoleEntity])],
  providers: [
    {
      provide: StaffRoleRepository,
      useClass: StaffRoleRelationalRepository,
    },
  ],
  exports: [StaffRoleRepository],
})
export class RelationalStaffRolePersistenceModule {}
