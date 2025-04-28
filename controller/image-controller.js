const Image = require("../model/image");
const fs = require("fs");
const cloudinary = require("../config/cloudinary")
const {uploadToCloudinary} = require("../helper/cloudinary-helper")
async function uploadImage(req,res){
    try{
        //check file is missing
        if(!req.file){
            return res.status(400).json({
                status : false,
                message : "File is missing"
            })
        }
        if (!req.userInfo || !req.userInfo.userId) {
            return res.status(401).json({
              status: false,
              message: "User not authenticated",
            });
          }

        //upload to cloudinary
        const {url,publicId} = await uploadToCloudinary(req.file.path)

        // storing mongodb database

        const newlyUploadedImage = await Image.create({
            url,
            publicId,
            uploadedBy : req.userInfo.userId
        })
         //to delete the image in local storage
        fs.unlinkSync(req.file.path)
        res.status(201).json({
            status : true,
            message : "file uploaded successfully",
            image : newlyUploadedImage
        })
       
        
    }
    catch(e){
        console.error(e)
        res.status(500).json({
            status : false,
            message : "Something went wrong in uploading"
        })
    }
}

async function deleteImage(req,res){
    try{
        const idOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo.userId;
    //checking image exists with such id or not 
    const image= await Image.findOne({_id : idOfImageToBeDeleted});
    if(!image){
        return res.status(404).json({message : "no image found with such id"});
    }

    //checking the user is authenticated to delete the image
    if(image.uploadedBy.toString()!==userId){
        return res.status(400).json({message : "You are not authenticated to delete the image uploaded by someone else"})
    }

    //deleting the image from the cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    //delete the image from mongoDb database
    await Image.deleteOne({_id : idOfImageToBeDeleted});    
    return res.status(200).json({message : "image deleted successfully"})
    }
    catch(e){
        console.error(e);
        res.status(500).json({message : "Something went wrong"})
    }
}

//to get the images on image database
//req.query is used to do the changes in by frontend instad of writing backend code everytime 
//dynamically sorting can be done 
//search it on chatGpt for more clear informatioin
async function getImages(req,res){
    try{
    const page = parseInt(req.query.page) || 1  //current page
    const limit = parseInt(req.query.limit) || 4  // the no. of imgs per page
    const skip = (page-1)*limit ;
    const sortBy = req.query.sortBy || "createdAt" ;
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1 ;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages/limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if(!images){
        return res.status(400).json({message : "Unable to fetch the Images"})
    }
    return res.status(200).json({message : "Images are fetched successfully",
        currentPage : page,
        totalImages : totalImages,
        totalPages : totalPages,
        data : images

    })
    } 
    catch(e){
        console.error(e);
        return res.status(500).json({message : "something went wrong"})
    }
}

module.exports = {uploadImage,deleteImage,getImages}