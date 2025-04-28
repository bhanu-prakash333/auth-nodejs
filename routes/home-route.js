const express = require("express");
const {authMiddleware} = require("../middleware/auth-middleware")
const homeRouter = express.Router()
homeRouter.get("/home",authMiddleware,(req,res)=>{
   const {username,email,role,userId} = req.userInfo;
   res.status(200).json({
    message : "welcome to the Homepage",
    username,
    email,
    role,
    userId
   })
});
module.exports = homeRouter;