const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true,"username is required"],
        unique : true,
        maxLength : [8,"username cant be more than 9 charas"]
    },
    email : {
        type :String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
    },
    role : {
        type : String,
        enum : ["user","admin"],
        default : "user",
        trim : true
    }
},
{
    timestamps : true
})
module.exports = mongoose.model("User",userSchema);