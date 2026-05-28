import express from "express";
import {
  submitAttempt,
  getMyAttempts,
  getQuizAttempts,
  getLeaderboard,
} from "../controllers/attemptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Submit attempt
router.post("/:quizId", protect, submitAttempt);

// My attempts — must be before /:quizId patterns
router.get("/my-attempts", protect, getMyAttempts);

// Quiz creator sees all attempts for their quiz
router.get("/quiz/:quizId", protect, getQuizAttempts);

// Leaderboard — public
router.get("/leaderboard/:quizId", getLeaderboard);

export default router;
