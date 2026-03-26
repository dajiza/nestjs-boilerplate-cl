import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalComService } from './cal-com.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CalComService],
  exports: [CalComService],
})
export class CalComModule {}
