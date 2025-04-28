function adminMiddleware(req,res,next){
    const {role} = req.userInfo;
    if(role!="admin"){
        return res.status(400).json({message:"Only admin can access the page"})
    }
    next()
}
module.exports = {adminMiddleware}