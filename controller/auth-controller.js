const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../model/user");
const { findOne } = require("../model/image");

async function registerUser(req,res){

    try{
        const {username,email,password,role} = req.body;
        const checkUserExist = await User.findOne({$or:[{username:username},{email:email}]})
            if(!checkUserExist){
    
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password,salt);
    
                if(req.body){
                    const newUser = await User.create({
                        username : req.body.username,
                        email : req.body.email, 
                        password : hashedPassword,
                        role : req.body.role
                    })
                    res.status(201).json({status:true,message:"registered successfully",data : {newUser}})
                }
                else{
                    res.status(400).json({status:false,message:"No input fields"})
                }
            }
            else{
                res.status(400).json({status:false,message:"User or Email matches"})
            }
    }

    catch(e){
        console.log(e);
        res.status(500).json({message:"Something went wrong"})
    }

    }

async function loginUser(req,res){
   try{
        if(!req.body){
            return res.status(400).json({message : "input fields are empty"})
        }
        const {username,password} = req.body;
        const exitsUsername = await User.findOne({username:username})
        if(!exitsUsername){
            return res.status(404).json({status:false,message : "Username not found in DB"})
        }
        const compareDetails = await bcrypt.compare(req.body.password,exitsUsername.password);
        //Token generation

        if(compareDetails){
            const payload = {
                userId : exitsUsername._id,
                username : exitsUsername.username,
                email : exitsUsername.email,
                role : exitsUsername.role
            }
            const token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"30m"});
            return res.status(200).json({status : true, message : "Token Generated",token : token})
        }
        else {
            return res.status(400).json({message:"credetials not matched"})
        }

   }
   catch(e){
    console.log(e);
    res.status(500).json({message : "Something went wrong"})
   }

}
//To change the password 
async function changePassword(req,res){
    try{
        const userId = req.userInfo.userId;
        const user = await User.findOne({_id : userId})
        if(!user){
            return res.status(400).json({message : "No user found with such userId"})
        }
        const {oldPassword,newPassword} = req.body;
        const result = await bcrypt.compare(oldPassword,user.password);

        //old pass matching or not
        if(!result){
            return res.status(400).json({message : "old password is not matched"})
        }
        const salt = await bcrypt.genSalt(10);
        const newhash = await bcrypt.hash(newPassword,salt);
        if(!newhash){
            return res.status(400).json({message : "Error in bcrypt"})
        }

        await User.updateOne({_id : userId},{$set:({password : newhash})})

        return res.status(201).json({success : true ,message : "Password changed sucessfully",userId : userId})

    }
    catch(e){
        console.error(e);
        res.status(500).json({message : "Something went wrong in changing the password"})
    }
}

module.exports = {registerUser,loginUser,changePassword}