import { Module } from '@nestjs/common';
import { BoatsModule } from './boats/boats.module';
import { BannerModule } from './pagebanner/banner.module';

@Module({
  imports: [BoatsModule, BannerModule],
})
export class AdminModule {}
