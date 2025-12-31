// infrastructure/storage/cloudinary.client.ts
import { v2 as cloudinaryLib, UploadApiResponse } from "cloudinary";

// Ensure credentials are set
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary credentials are not set in environment variables");
}

// Configure Cloudinary
cloudinaryLib.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a file to Cloudinary
 * @param filePath Base64 string or local file path
 * @param folder Optional folder name
 * @returns URL of uploaded file
 */
export async function uploadImage(filePath: string, folder = "properties"): Promise<string> {
  const result: UploadApiResponse = await cloudinaryLib.uploader.upload(filePath, { folder });
  if (!result.secure_url) throw new Error("Cloudinary upload failed");
  return result.secure_url;
}

/**
 * Cloudinary Admin Client (optional)
 */
export class CloudinaryClient {
  static async upload(filePath: string, folder?: string): Promise<UploadApiResponse> {
    const options = folder ? { folder } : {};
    return await cloudinaryLib.uploader.upload(filePath, options);
  }

  static async delete(publicId: string): Promise<any> {
    return await cloudinaryLib.uploader.destroy(publicId);
  }
}

export { cloudinaryLib as cloudinary };
