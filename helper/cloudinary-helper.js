const cloudinary = require("../config/cloudinary");
async function uploadToCloudinary(filepath){
    try{
      const result = await cloudinary.uploader.upload(filepath)
      return {
        url : result.secure_url,
        publicId : result.public_id
      }
    }
    catch(e){
        console.error("Error while uploading a file to the cloudinary",e)
    }
}

module.exports = {uploadToCloudinary}