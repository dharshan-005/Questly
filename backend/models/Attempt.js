import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        selectedAnswer: Number,
        isCorrect: Boolean,
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Prevent duplicate attempts — one attempt per user per quiz per session
// Remove this if you want users to retake quizzes
// attemptSchema.index({ quiz: 1, user: 1 }, { unique: true });

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;
