import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BoulevardService } from './boulevard.service';
import { BoulevardController } from './boulevard.controller';

@Module({
  imports: [HttpModule],
  providers: [BoulevardService],
  controllers: [BoulevardController],
  exports: [BoulevardService],
})
export class BoulevardModule {}
