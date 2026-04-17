import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientSeedService } from './client-seed.service';
import { ClientEntity } from '../../../../../clients/infrastructure/persistence/relational/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  providers: [ClientSeedService],
  exports: [ClientSeedService],
})
export class ClientSeedModule {}
