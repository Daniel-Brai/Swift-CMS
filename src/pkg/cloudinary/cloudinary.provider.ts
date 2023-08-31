import { ConfigService } from '@pkg/config';
import { v2 } from 'cloudinary';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    return v2.config({
      cloud_name: `${configService.get().services.cloudinary.name}`,
      api_key: `${configService.get().services.cloudinary.api_key}`,
      api_secret: `${configService.get().services.cloudinary.secret_key}`,
    });
  },
  inject: [ConfigService],
};
