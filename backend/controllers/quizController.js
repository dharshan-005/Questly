import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";

// @route  POST /api/quizzes
// Create a quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, category, questions } = req.body;

    if (!title || !category || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, category and at least one question are required",
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      category,
      questions,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/quizzes
// Get all published quizzes (public)
export const getAllQuizzes = async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = { isPublished: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = { $regex: category, $options: "i" };
    }

    const quizzes = await Quiz.find(filter)
      .populate("createdBy", "name")
      .select("-questions.correctAnswer")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/quizzes/:id
// Get single quiz — with correct answers hidden for listing, shown for taking
export const getSingleQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate(
      "createdBy",
      "name",
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/quizzes/my-quizzes
// Get quizzes created by logged in user
export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/quizzes/:id
// Update quiz — only by creator
export const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized — you can only edit your own quizzes",
      });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  DELETE /api/quizzes/:id
// Delete quiz - only by creator
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized — you can only delete your own quizzes",
      });
    }

    await quiz.deleteOne();

    await Attempt.deleteMany({ quiz: req.params.id });

    res.status(200).json({
      success: true,
      message: "Quiz and all its attempts deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
