import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log("database connected successfully");
}).catch((err) => {
    console.log(err);
});

const app = express();

app.listen(3000, () => {
  console.log("server listening on port 3000");
});

app.use(express.json());
app.use("/api/user", userRoute);