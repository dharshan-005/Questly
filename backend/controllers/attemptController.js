import Attempt from "../models/Attempt.js";
import Quiz from "../models/Quiz.js";

// @route  POST /api/attempts/:quizId
// Submit a quiz attempt
export const submitAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (!quiz.isPublished) {
      return res.status(400).json({
        success: false,
        message: "This quiz is not available",
      });
    }

    // Grade the answers
    const gradedAnswers = quiz.questions.map((q, index) => ({
      questionIndex: index,
      selectedAnswer: answers[index],
      isCorrect: answers[index] === q.correctAnswer,
    }));

    const score = gradedAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Save attempt
    const attempt = await Attempt.create({
      quiz: quizId,
      user: req.user.id,
      answers: gradedAnswers,
      score,
      totalQuestions,
      percentage,
      timeTaken: timeTaken || 0,
    });

    // Update quiz stats
    const allAttempts = await Attempt.find({ quiz: quizId });
    const totalAttempts = allAttempts.length;
    const averageScore = Math.round(
      allAttempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts,
    );

    await Quiz.findByIdAndUpdate(quizId, { totalAttempts, averageScore });

    // Populate quiz info for response
    await attempt.populate("quiz", "title category questions");

    res.status(201).json({
      success: true,
      message: "Attempt submitted successfully",
      attempt,
      result: {
        score,
        totalQuestions,
        percentage,
        gradedAnswers,
        questions: quiz.questions,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/attempts/my-attempts
// Get all attempts by logged in user
export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ user: req.user.id })
      .populate("quiz", "title category questions totalAttempts averageScore")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/attempts/quiz/:quizId
// Get all attempts for a specific quiz - for quiz creator
export const getQuizAttempts = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const attempts = await Attempt.find({ quiz: req.params.quizId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/attempts/leaderboard/:quizId
// Get top 10 scores for a quiz
export const getLeaderboard = async (req, res) => {
  try {
    const attempts = await Attempt.find({ quiz: req.params.quizId })
      .populate("user", "name")
      .sort({ percentage: -1, timeTaken: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      attempts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
