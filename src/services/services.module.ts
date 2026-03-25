import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { RelationalServicePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalServicePersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService, infrastructurePersistenceModule],
})
export class ServicesModule {}
