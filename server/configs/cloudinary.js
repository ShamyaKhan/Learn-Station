const { v2 } = require("cloudinary");
const {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
} = require("../utils/constants");

const connectCloudinary = async () => {
  v2.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY,
  });
};

module.exports = connectCloudinary;
