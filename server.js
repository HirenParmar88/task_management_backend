// server.js

import express from "express";
import dotenv from "dotenv";
dotenv.config(); 
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import taskRouter from "./router/taskRouter.js";
import "./jobs/eodJob.js";

const app = express();
const PORT = process.env.PORT || 5000;
const mongoDBURL = process.env.MONGODB_URL;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/tasks", taskRouter);

mongoose.connect(mongoDBURL, {
//   useNewUrlParser: true,
})
.then(() => {
  console.log('Connected to MongoDB Successfully!');
  app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

