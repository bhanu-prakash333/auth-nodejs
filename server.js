require("dotenv").config();
const express = require("express");
const authrouter = require("./routes/auth-routes");
const homeRouter = require("./routes/home-route")
const adminRouter = require("./routes/admin-route")
const {mongoDB} = require("./database/db")
const imageRouter = require("./routes/image-routes")


const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connection

mongoDB();
app.use("/auth",authrouter);
app.use("/",homeRouter);
app.use("/",adminRouter);
app.use("/image",imageRouter);

app.listen(PORT,()=>{console.log(`Server is started with PORT - ${PORT}`)})