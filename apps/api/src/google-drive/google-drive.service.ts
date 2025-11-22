import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; 
import { google, drive_v3 } from 'googleapis';
import { Stream } from 'stream';


@Injectable()
export class GoogleDriveService {
    private drive: drive_v3.Drive;
    private readonly folderId: string;
    private readonly jobOpeningFolderId: string;

    constructor(private configService: ConfigService) {
        
        const client_id = this.configService.get<string>('DRIVE_OAUTH_CLIENT_ID');
        const client_secret = this.configService.get<string>('DRIVE_OAUTH_CLIENT_SECRET');
        const refresh_token = this.configService.get<string>('GOOGLE_REFRESH_TOKEN');
        const GOOGLE_DRIVE_FOLDER_ID = this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID');
        const JOB_OPENING_FOLDER_ID = this.configService.get<string>('JOB_OPENING_FOLDER_ID');

        console.log('--- GoogleDriveService Init ---');
        if (!client_id || !client_secret || !refresh_token || !GOOGLE_DRIVE_FOLDER_ID || !JOB_OPENING_FOLDER_ID) {
            console.error('Missing configuration detected!');
            throw new InternalServerErrorException(
                'Google Drive OAuth configuration is missing. Ensure Client ID, Secret, Refresh Token, Default Folder ID (GOOGLE_DRIVE_FOLDER_ID), and Job Folder ID (JOB_OPENING_FOLDER_ID) are set in your environment.',
            );
        }
        
        this.folderId = GOOGLE_DRIVE_FOLDER_ID;
        this.jobOpeningFolderId = JOB_OPENING_FOLDER_ID;

        const auth = new google.auth.OAuth2(
            client_id,
            client_secret,
        );

        auth.setCredentials({ 
            refresh_token: refresh_token,
        });

        this.drive = google.drive({ version: 'v3', auth });
        console.log('Google Drive OAuth client initialized successfully.');
    }

    public getJobOpeningRootFolderId(): string {
        return this.jobOpeningFolderId;
    }

    async findOrCreateFolder(folderName: string, parentFolderId: string): Promise<string> {
        console.log(`[findOrCreateFolder] Starting search for folder: ${folderName} in parent: ${parentFolderId}`);
        try {
            
            const q = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and '${parentFolderId}' in parents`;

            const response = await this.drive.files.list({
                q: q,
                fields: 'files(id)',
                spaces: 'drive',
            });

            const files = response.data.files || [];

            if (files.length > 0) {
                console.log(`[findOrCreateFolder] Found existing folder ID: ${files[0].id}`);
                
                return files[0].id!;
            }

            console.log(`[findOrCreateFolder] Folder not found. Creating new folder: ${folderName}`);
            
            const fileMetadata = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentFolderId],
            };

            const createdFolder = await this.drive.files.create({
                requestBody: fileMetadata,
                fields: 'id',
            });

            const newFolderId = createdFolder.data.id;
            
            if (newFolderId) {
                console.log(`[findOrCreateFolder] New folder created with ID: ${newFolderId}`);
                
                await this.grantPermissions(newFolderId); 
            }

            return newFolderId!;

        } catch (error) {
            console.error('[findOrCreateFolder] Google Drive Folder Creation/Search Error:', error.message);
            throw new InternalServerErrorException(`Failed to find or create folder "${folderName}" in Google Drive.`);
        }
    }
    
    public async grantPermissions(fileId: string): Promise<void> {
        console.log(`[grantPermissions] Setting permissions for file/folder ID: ${fileId}`);
        try {
            await this.drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
            console.log(`[grantPermissions] Permissions granted successfully for ID: ${fileId}`);
        } catch (error) {
            
            console.warn('[grantPermissions] Failed to set public permissions on new folder:', error.message);
        }
    }

    async uploadFile(
        file: Express.Multer.File,
        filename: string,
    ): Promise<string> {
        console.log(`[uploadFile] Attempting to upload file: ${filename} (Mime: ${file.mimetype}) to default folder: ${this.folderId}`);
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
                console.error('[uploadFile] Response lacked file ID.');
                throw new Error('Google Drive file ID not returned after upload.');
            }
            console.log(`[uploadFile] File uploaded successfully. ID: ${response.data.id}`);
            return response.data.id;
        } catch (error) {
            console.error('[uploadFile] Google Drive Upload Error (Default Folder):', error.message); 
            throw new InternalServerErrorException('Failed to upload file to Google Drive.');
        }
    }

    async uploadJobPosting(
        file: Express.Multer.File,
        filename: string,
        companyFolderId: string, 
    ): Promise<string> {
        console.log(`[uploadJobPosting] Attempting to upload file: ${filename} to company folder: ${companyFolderId}`);
        try {
            const fileMetadata = {
                name: filename,
                parents: [companyFolderId], 
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
                console.error('[uploadJobPosting] Response lacked file ID.');
                throw new Error('Google Drive file ID not returned after job posting upload.');
            }
            console.log(`[uploadJobPosting] File uploaded successfully. ID: ${response.data.id}`);
            return response.data.id;
        } catch (error) {
            console.error('Google Drive Upload Error (Job Posting Folder):', error.message); 
            throw new InternalServerErrorException('Failed to upload job posting file to Google Drive.');
        }
    }

    async downloadFile(fileId: string): Promise<Buffer> {
        console.log(`[downloadFile] Attempting to download file ID: ${fileId}`);
        try {
            const response = await this.drive.files.get(
                {
                    fileId: fileId,
                    alt: 'media',
                },
                { responseType: 'arraybuffer' }
            );

            const fileBuffer = Buffer.from(response.data as ArrayBuffer);

            console.log(`[downloadFile] File downloaded successfully. Size: ${fileBuffer.length} bytes`);
            
            return fileBuffer;
        } catch (error) {
            console.error('Google Drive Download Error:', error.message);
            throw new InternalServerErrorException(
                `Failed to download file ${fileId} from Google Drive.`,
            );
        }
    }

    async deleteFile(fileId: string): Promise<void> {
        console.log(`[deleteFile] Attempting to delete file ID: ${fileId}`);
        try {
            await this.drive.files.delete({
                fileId: fileId,
            });
            console.log(`[deleteFile] File deleted successfully: ${fileId}`);
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