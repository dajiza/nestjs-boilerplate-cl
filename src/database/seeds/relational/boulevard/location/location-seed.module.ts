import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationSeedService } from './location-seed.service';
import { LocationEntity } from '../../../../../locations/infrastructure/persistence/relational/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  providers: [LocationSeedService],
  exports: [LocationSeedService],
})
export class LocationSeedModule {}
