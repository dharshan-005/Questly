import express from "express";

import {
  submitAttempt,
  getMyAttempts,
  getQuizAttempts,
  getLeaderboard,
} from "../controllers/attemptController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:quizId", protect, submitAttempt);
router.get("/my-attempts", protect, getMyAttempts);
router.get("/quiz/:quizId", protect, getQuizAttempts);
router.get("/leaderboard/:quizId", getLeaderboard);

export default router;
