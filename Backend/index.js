import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 8080;

import connectDB from "./DB/connectDB.js";
connectDB();

import userRoutes from "./Routes/userRoutes.js";

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Routes
app.use("/api/v1/user", userRoutes);
// http://localhost:8000/api/v1/user/register

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
