import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FILE_STORAGE } from './storage.interface';
import { LocalStorageService } from './local-storage.service';
import { S3StorageService } from './s3-storage.service';

@Module({
  providers: [
    LocalStorageService,
    S3StorageService,
    {
      provide: FILE_STORAGE,
      inject: [ConfigService, LocalStorageService, S3StorageService],
      useFactory: (
        env: ConfigService,
        local: LocalStorageService,
        s3: S3StorageService,
      ) => (env.get<string>('STORAGE_PROVIDER') === 's3' ? s3 : local),
    },
  ],
  exports: [FILE_STORAGE, LocalStorageService, S3StorageService],
})
export class StorageModule {}
