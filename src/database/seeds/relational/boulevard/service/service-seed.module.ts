import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSeedService } from './service-seed.service';
import { ServiceEntity } from '../../../../../services/infrastructure/persistence/relational/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity])],
  providers: [ServiceSeedService],
  exports: [ServiceSeedService],
})
export class ServiceSeedModule {}
