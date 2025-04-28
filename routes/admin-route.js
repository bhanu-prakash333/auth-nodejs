const express = require("express");
const adminRouter = express.Router();
const {adminMiddleware} = require("../middleware/admin-middleware")
const {authMiddleware} = require("../middleware/auth-middleware")

adminRouter.get("/admin",authMiddleware,adminMiddleware,(req,res)=>{
    res.status(200).json({
        message : "welcome to the admin page"
    })
})

module.exports = adminRouter