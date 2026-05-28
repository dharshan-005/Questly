import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

import quizRoutes from "./routes/quizRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js"

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5175", // Since I want it to run on port 5175 (change it accordingly if you use a different port)
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/quizzes", quizRoutes);
app.use("/api/attempts", attemptRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Questly API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
