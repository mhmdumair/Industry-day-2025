import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; 
import { google, drive_v3 } from 'googleapis';
import { Stream } from 'stream';

@Injectable()
export class GoogleDriveService {
    private drive: drive_v3.Drive;
    private readonly folderId: string;

    constructor(private configService: ConfigService) {
        
        const client_id = this.configService.get<string>('DRIVE_OAUTH_CLIENT_ID');
        const client_secret = this.configService.get<string>('DRIVE_OAUTH_CLIENT_SECRET');
        const refresh_token = this.configService.get<string>('GOOGLE_REFRESH_TOKEN');
        const GOOGLE_DRIVE_FOLDER_ID = this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');

        if (!client_id || !client_secret || !refresh_token || !GOOGLE_DRIVE_FOLDER_ID) {
            throw new InternalServerErrorException(
                'Google Drive OAuth configuration is missing. Ensure Client ID, Secret, Refresh Token, and Folder ID are set in your environment.',
            );
        }
        
        this.folderId = GOOGLE_DRIVE_FOLDER_ID;

        const auth = new google.auth.OAuth2(
            client_id,
            client_secret,
        );

        auth.setCredentials({ 
            refresh_token: refresh_token,
        });

        this.drive = google.drive({ version: 'v3', auth });
    }

    async uploadFile(
        file: Express.Multer.File,
        filename: string,
    ): Promise<string> {
        try {
            const fileMetadata = {
                name: filename,
                parents: [this.folderId],
            };

            const media = {
                mimeType: file.mimetype,
                body: Stream.Readable.from(file.buffer),
            };

            const response = await this.drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id',
            });

            if (!response.data.id) {
                throw new Error('Google Drive file ID not returned after upload.');
            }
            return response.data.id;
        } catch (error) {
            console.error('Google Drive Upload Error:', error.message); 
            throw new InternalServerErrorException('Failed to upload file to Google Drive.');
        }
    }

    async deleteFile(fileId: string): Promise<void> {
        try {
            await this.drive.files.delete({
                fileId: fileId,
            });
        } catch (error) {
            console.error('Google Drive Delete Error:', error.message);
            throw new InternalServerErrorException(
                `Failed to delete file ${fileId} from Google Drive.`,
            );
        }
    }
    
    getShareLink(driveFileId: string): string {
        return `https://drive.google.com/file/d/${driveFileId}/view?usp=sharing`;
    }
}