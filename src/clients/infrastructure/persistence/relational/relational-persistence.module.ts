import { Module } from '@nestjs/common';
import { ClientRepository } from '../client.repository';
import { ClientsRelationalRepository } from './repositories/client.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  providers: [
    {
      provide: ClientRepository,
      useClass: ClientsRelationalRepository,
    },
  ],
  exports: [ClientRepository],
})
export class RelationalClientPersistenceModule {}
