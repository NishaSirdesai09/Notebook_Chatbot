import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global so any feature module can inject PrismaService without re-importing.
 * Feature services currently use in-memory stores; inject PrismaService and
 * replace those stores to persist to the database.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
