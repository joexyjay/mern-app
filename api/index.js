import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log("database connected successfully");
}).catch((err) => {
    console.log(err);
});

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("server listening on port 3000");
});


app.use("/api/user", userRoute);
app.use("/api/auth", authRoute)

//middleware to handle errors
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})