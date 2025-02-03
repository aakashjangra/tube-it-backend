import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//uploads video, audio, image, pdf, etc.
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //uploading the file on cloudinary
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    //file uploaded successfully
    console.log("file is uploaded on cloudinary!", res, res.url, localFilePath);
    //remove locally save temp file when upload is done
    fs.unlinkSync(localFilePath);
    return res;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
}

export { uploadOnCloudinary };