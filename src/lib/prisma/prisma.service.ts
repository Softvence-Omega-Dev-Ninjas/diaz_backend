import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [{ emit: 'event', level: 'error' }],
    });

    this.$on('error', (e: Prisma.LogEvent) => {
      this.logger.error('Error IN PRISMA', e.message);
    });
  }

  async onModuleInit() {
    this.logger.log('[INIT] Prisma connected');
    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.log('[DESTROY] Prisma disconnected');
    await this.$disconnect();
  }
}
