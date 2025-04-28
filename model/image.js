const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    url : {
        type : String,
        requried : true,
    },
    publicId : {
        type : String,
        requried :true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    uploadedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"

    }
})

module.exports = mongoose.model("Image",imageSchema);