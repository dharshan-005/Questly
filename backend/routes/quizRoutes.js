import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getSingleQuiz,
  getMyQuizzes,
  updateQuiz,
  deleteQuiz,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllQuizzes);

// Protected — must be before /:id
router.get("/my-quizzes", protect, getMyQuizzes);

// Public
router.get("/:id", getSingleQuiz);

// Protected
router.post("/", protect, createQuiz);
router.put("/:id", protect, updateQuiz);
router.delete("/:id", protect, deleteQuiz);

export default router;
