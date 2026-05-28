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

router.get("/", getAllQuizzes);

router.get("/my-quizzes", protect, getMyQuizzes);

router.get("/:id", getSingleQuiz);

router.post("/", protect, createQuiz);
router.put("/:id", protect, updateQuiz);
router.delete("/:id", protect, deleteQuiz);

export default router;
