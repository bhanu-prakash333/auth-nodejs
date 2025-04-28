const express = require("express");
const imageRouter = express.Router();
const {authMiddleware} = require("../middleware/auth-middleware")
const {adminMiddleware} = require("../middleware/admin-middleware");
const {upload} = require("../middleware/upload-middleware")
const {uploadImage,deleteImage,getImages} =require("../controller/image-controller")

//upload image
imageRouter.post("/upload",authMiddleware,adminMiddleware,upload.single("image"),uploadImage)
imageRouter.delete("/:id",authMiddleware,adminMiddleware,deleteImage);
imageRouter.get("/get",authMiddleware,getImages)

module.exports = imageRouter;