import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload a file to Cloudinary
 * @param file - The file buffer to upload
 * @param filename - Original filename (used for reference)
 * @returns Promise with upload result
 */
export async function uploadToCloudinary(buffer: Buffer, filename: string) {
  try {
    return new Promise((resolve, reject) => {
      // Create a readable stream from the buffer
      const stream = require('stream');
      const readableStream = new stream.PassThrough();
      readableStream.end(buffer);
      
      // Create upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'zod-borovany-menu',
          resource_type: 'auto',
          public_id: `menu-${Date.now()}`,
          format: 'pdf',
        },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      // Pipe the readable stream to the upload stream
      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
}

export default cloudinary;
