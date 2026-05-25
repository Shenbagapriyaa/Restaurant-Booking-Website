import { v2 as cloudinary } from "cloudinary";

const configureCloudinary = () => {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "placeholder_cloud_name"
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary integrated successfully.");
  } else {
    console.log("Cloudinary details not configured. Falling back to local file storage / direct URLs.");
  }
};

export { cloudinary, configureCloudinary };
export default configureCloudinary;
