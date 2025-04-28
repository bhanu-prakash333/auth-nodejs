const multer = require("multer");
const path = require("path");

//set the storage
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,"./uploads")
    },
    filename : (req,file,cb)=>{
        cb(null,file.fieldname+path.extname(file.originalname))
    }
})


//filter 
const fileFilter = (req,file,cb)=>{
    const allow = ["image/jpeg","image/jpg","image/png","image/webp"];
    if(allow.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(new Error("file not accepted"),false)
    }
}
const upload = multer({storage : storage,fileFilter : fileFilter})
module.exports = {upload}