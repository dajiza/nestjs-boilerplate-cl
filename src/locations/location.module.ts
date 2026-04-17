import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { RelationalLocationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalLocationPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService, infrastructurePersistenceModule],
})
export class LocationModule {}
