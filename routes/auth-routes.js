const express = require("express");
const router = express.Router();
const {registerUser,loginUser,changePassword} = require("../controller/auth-controller")
const {authMiddleware} = require("../middleware/auth-middleware")

router.post("/register",registerUser)
router.get("/login",loginUser)
router.post("/changepassword",authMiddleware,changePassword)

module.exports = router;