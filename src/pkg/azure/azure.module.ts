import { Module } from '@nestjs/common';
import { AzureBlobStorageService } from './services/storage.service';
import { ConfigModule } from '@pkg/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [AzureBlobStorageService],
  exports: [AzureBlobStorageService],
})
export class AzureModule {}
