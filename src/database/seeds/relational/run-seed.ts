import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { BusinessSeedService } from './boulevard/business/business-seed.service';
import { LocationSeedService } from './boulevard/location/location-seed.service';
import { StaffRoleSeedService } from './boulevard/staff-role/staff-role-seed.service';
import { StaffSeedService } from './boulevard/staff/staff-seed.service';
import { ServiceCategorySeedService } from './boulevard/service-category/service-category-seed.service';
import { ServiceSeedService } from './boulevard/service/service-seed.service';
import { ClientSeedService } from './boulevard/client/client-seed.service';
import { AppointmentSeedService } from './boulevard/appointment/appointment-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // System seeds
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();

  // Boulevard data seeds
  await app.get(BusinessSeedService).run();
  await app.get(LocationSeedService).run();
  await app.get(StaffRoleSeedService).run();
  await app.get(StaffSeedService).run();
  await app.get(ServiceCategorySeedService).run();
  await app.get(ServiceSeedService).run();
  await app.get(ClientSeedService).run();
  await app.get(AppointmentSeedService).run();

  await app.close();
};

void runSeed();
