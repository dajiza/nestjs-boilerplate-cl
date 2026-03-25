import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { RelationalStaffPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalStaffPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService, infrastructurePersistenceModule],
})
export class StaffModule {}
