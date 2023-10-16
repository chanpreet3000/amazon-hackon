import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { errorHandler } from "./util.js";
import customerRouter from "./routes/customer.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

//Routes
app.use("/api/customer", customerRouter);

// Error handler
app.use(errorHandler);

// Connecting Database and Server
const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => {
      console.log(`Server Started and listening to ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
