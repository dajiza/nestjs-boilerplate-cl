import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffSeedService } from './staff-seed.service';
import { StaffEntity } from '../../../../../staff/infrastructure/persistence/relational/entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffEntity])],
  providers: [StaffSeedService],
  exports: [StaffSeedService],
})
export class StaffSeedModule {}
