const jwt = require("jsonwebtoken");

function authMiddleware(req,res,next){
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);

    if(!token){
        return res.status(400).json({message : "Token not found"})
    }

    try{
        const decodeToken = jwt.verify(token,process.env.SECRET_KEY);
        req.userInfo = decodeToken;
        next()
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message : "Decode Error"})
    }

}

module.exports = {authMiddleware};