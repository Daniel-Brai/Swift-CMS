import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BlobDeleteIfExistsResponse,
  BlobServiceClient,
  BlockBlobClient,
} from '@azure/storage-blob';
import { ConfigService } from '@pkg/config';
import { v1 as uuidv1 } from 'uuid';

/**
 * Provides a means of calling the azure blob upload service
 */
@Injectable()
export class AzureBlobStorageService {
  constructor(private readonly configService: ConfigService) {}
  private readonly containerName: string =
    this.configService.get().services.azure.blob.storage_container_name;

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExt = file.originalname.split('.').pop();
    const filename = uuidv1() + '.' + fileExt;

    try {
      const blockBlobClient = await this.getBlobClient(filename);
      await blockBlobClient.uploadData(file.buffer);
      return blockBlobClient.url;
    } catch (error) {
      throw new BadRequestException(
        `An error occured while uploading the file: ${file.originalname}`,
        error,
      );
    }
  }

  public async uploadFiles(
    files: Array<Express.Multer.File>,
  ): Promise<Array<PromiseSettledResult<string>>> {
    const urls = await Promise.allSettled(
      files.map(async (file): Promise<string> => {
        const uploadUrl = await this.uploadFile(file);
        return uploadUrl;
      }),
    );
    return urls;
  }

  public async deleteFile(
    filename: string,
  ): Promise<BlobDeleteIfExistsResponse> {
    try {
      const blockBlobClient = await this.getBlobClient(filename);
      return await blockBlobClient.deleteIfExists();
    } catch (error) {
      throw new BadRequestException(
        `An error occured while trying to delete the file: ${filename}`,
        error,
      );
    }
  }

  public async deleteFiles(
    filenames: Array<string>,
  ): Promise<Array<PromiseSettledResult<BlobDeleteIfExistsResponse>>> {
    const responses = await Promise.allSettled(
      filenames.map(async (file): Promise<BlobDeleteIfExistsResponse> => {
        return await this.deleteFile(file);
      }),
    );
    return responses;
  }

  private async getBlobClient(filename: string): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerClient = blobService.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    return blockBlobClient;
  }

  private async getBlobServiceInstance(): Promise<BlobServiceClient> {
    const connectionString =
      this.configService.get().services.azure.blob.storage_connection_string;
    const blobClientService =
      BlobServiceClient.fromConnectionString(connectionString);

    return blobClientService;
  }
}
