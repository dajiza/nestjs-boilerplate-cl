import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { RelationalClientPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalClientPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService, infrastructurePersistenceModule],
})
export class ClientsModule {}
