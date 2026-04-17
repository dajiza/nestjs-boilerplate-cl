import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../../typeorm-config.service';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import { BusinessSeedModule } from './boulevard/business/business-seed.module';
import { LocationSeedModule } from './boulevard/location/location-seed.module';
import { StaffRoleSeedModule } from './boulevard/staff-role/staff-role-seed.module';
import { StaffSeedModule } from './boulevard/staff/staff-seed.module';
import { ServiceCategorySeedModule } from './boulevard/service-category/service-category-seed.module';
import { ServiceSeedModule } from './boulevard/service/service-seed.module';
import { ClientSeedModule } from './boulevard/client/client-seed.module';
import { AppointmentSeedModule } from './boulevard/appointment/appointment-seed.module';
import databaseConfig from '../../config/database.config';
import appConfig from '../../../config/app.config';

@Module({
  imports: [
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    BusinessSeedModule,
    LocationSeedModule,
    StaffRoleSeedModule,
    StaffSeedModule,
    ServiceCategorySeedModule,
    ServiceSeedModule,
    ClientSeedModule,
    AppointmentSeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
