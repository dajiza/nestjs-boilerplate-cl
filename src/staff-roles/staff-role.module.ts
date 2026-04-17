import { Module } from '@nestjs/common';
import { StaffRoleController } from './staff-role.controller';
import { StaffRoleService } from './staff-role.service';
import { RelationalStaffRolePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalStaffRolePersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [StaffRoleController],
  providers: [StaffRoleService],
  exports: [StaffRoleService, infrastructurePersistenceModule],
})
export class StaffRoleModule {}
