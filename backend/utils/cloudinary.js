import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: 'dkoojleyl',
  api_key: '347749388457116',
  api_secret: 'XoYjaLx5cThijBCX3ZIQuGTtGbU',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rides-by-julius',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1400, height: 900, crop: 'limit', quality: 'auto' }],
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export { cloudinary };