import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(file: string, folder = "properties") {
  // file: base64 string or path
  const result = await cloudinary.uploader.upload(file, { folder });
  return result.secure_url;
}
