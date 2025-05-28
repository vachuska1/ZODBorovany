import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary with validation
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary environment variables are not properly configured');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

interface CloudinaryUploadResult extends UploadApiResponse {
  secure_url: string;
  public_id: string;
  format: string;
}

/**
 * Upload a file to Cloudinary with PDF optimization
 * @param buffer - The file buffer to upload
 * @param filename - Original filename (used for reference)
 * @returns Promise with upload result containing the secure URL
 */
export async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<CloudinaryUploadResult> {
  try {
    console.log('Starting Cloudinary upload for file:', filename);
    
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'zod-borovany-menu',
          resource_type: 'auto',
          public_id: `menu-${Date.now()}`,
          format: 'pdf',
          type: 'upload',
          // Force download instead of display
          flags: 'attachment',
          // Ensure PDF is served with correct content type
          transformation: [
            { format: 'pdf' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else if (!result) {
            reject(new Error('No result from Cloudinary'));
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      );

      // Create a readable stream from the buffer and pipe to upload stream
      const { Readable } = require('stream');
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null); // Signal end of stream
      
      readableStream.pipe(uploadStream);
    });

    console.log('Successfully uploaded to Cloudinary:', {
      public_id: result.public_id,
      format: result.format,
      size: buffer.length,
      url: result.secure_url
    });

    // Return the result with the secure URL
    return {
      ...result,
      // Ensure we have a secure URL
      secure_url: result.secure_url.replace('http://', 'https://')
    };
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw new Error(`Nahrání souboru se nezdařilo: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
  }
}

/**
 * Get a secure, optimized URL for a PDF from Cloudinary
 * @param publicId - The Cloudinary public ID
 * @returns A secure URL that forces download of the PDF
 */
export function getOptimizedPdfUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    secure: true,
    flags: 'attachment',
    type: 'upload',
    resource_type: 'raw',
    sign_url: true,
    transformation: [
      { format: 'pdf' },
      { quality: 'auto:good' }
    ]
  });
}

export default cloudinary;
