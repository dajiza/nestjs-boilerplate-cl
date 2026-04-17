import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffRoleSeedService } from './staff-role-seed.service';
import { StaffRoleEntity } from '../../../../../staff-roles/infrastructure/persistence/relational/entities/staff-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffRoleEntity])],
  providers: [StaffRoleSeedService],
  exports: [StaffRoleSeedService],
})
export class StaffRoleSeedModule {}
