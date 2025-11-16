import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], 
  providers: [GoogleDriveService],
  exports: [GoogleDriveService],
})
export class GoogleDriveModule {}
