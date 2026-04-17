import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategorySeedService } from './service-category-seed.service';
import { ServiceCategoryEntity } from '../../../../../service-categories/infrastructure/persistence/relational/entities/service-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategoryEntity])],
  providers: [ServiceCategorySeedService],
  exports: [ServiceCategorySeedService],
})
export class ServiceCategorySeedModule {}
