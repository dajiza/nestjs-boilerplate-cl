import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { RelationalBusinessPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalBusinessPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService, infrastructurePersistenceModule],
})
export class BusinessModule {}
