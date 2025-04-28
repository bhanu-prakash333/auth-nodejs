const mongoose = require("mongoose");
async function mongoDB(){
    try{
        mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDb connection is establised successfully")
    }
    catch(e){
        console.error(e);
        process.exit(1);
    }
}
module.exports = {mongoDB};