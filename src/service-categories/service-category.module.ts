import { Module } from '@nestjs/common';
import { ServiceCategoryController } from './service-category.controller';
import { ServiceCategoryService } from './service-category.service';
import { RelationalServiceCategoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalServiceCategoryPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService],
  exports: [ServiceCategoryService, infrastructurePersistenceModule],
})
export class ServiceCategoryModule {}
