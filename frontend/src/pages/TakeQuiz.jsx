import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getSingleQuiz } from "../services/quizService";
import { submitAttempt } from "../services/attemptService";
import {
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Trophy,
} from "lucide-react";

const TakeQuiz = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Quiz state
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getSingleQuiz(id);
        if (data.success) {
          setQuiz(data.quiz);
          setAnswers(new Array(data.quiz.questions.length).fill(null));
        } else {
          setError("Quiz not found");
        }
      } catch (err) {
        setError("Cannot load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  // Start timer when quiz loads
  useEffect(() => {
    if (quiz && !submitted) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [quiz, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelectAnswer = (index) => {
    if (submitted) return;
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    // Save answer
    const updated = [...answers];
    updated[currentQ] = selectedAnswer;
    setAnswers(updated);
    setSelectedAnswer(answers[currentQ + 1] ?? null);
    setCurrentQ((prev) => prev + 1);
  };

  const handlePrev = () => {
    const updated = [...answers];
    updated[currentQ] = selectedAnswer;
    setAnswers(updated);
    setSelectedAnswer(answers[currentQ - 1] ?? null);
    setCurrentQ((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    // Save last answer
    const finalAnswers = [...answers];
    finalAnswers[currentQ] = selectedAnswer;
    setAnswers(finalAnswers);

    clearInterval(timerRef.current);
    setSubmitting(true);

    try {
      if (isAuthenticated) {
        const token = localStorage.getItem("token");
        const data = await submitAttempt(
          id,
          { answers: finalAnswers, timeTaken: elapsed },
          token,
        );
        if (data.success) {
          setResult(data.result);
        } else {
          setError(data.message || "Failed to submit");
          return;
        }
      } else {
        // Guest - grade locally
        const score = quiz.questions.reduce((count, q, i) => {
          return count + (finalAnswers[i] === q.correctAnswer ? 1 : 0);
        }, 0);
        const percentage = Math.round((score / quiz.questions.length) * 100);
        setResult({
          score,
          totalQuestions: quiz.questions.length,
          percentage,
          gradedAnswers: quiz.questions.map((q, i) => ({
            questionIndex: i,
            selectedAnswer: finalAnswers[i],
            isCorrect: finalAnswers[i] === q.correctAnswer,
          })),
          questions: quiz.questions,
        });
      }
      setSubmitted(true);
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((currentQ + 1) / (quiz?.questions?.length || 1)) * 100;

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary text-sm">Loading quiz...</p>
      </div>
    );
  }

  // Error
  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-sm text-danger">{error}</p>
        <Link to="/quizzes" className="text-xs text-primary hover:underline">
          Back to Quizzes
        </Link>
      </div>
    );
  }

  // Results Screen
  if (submitted && result) {
    return (
      <div className="min-h-screen bg-background pb-10">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Score Card */}
          <div className="bg-surface border border-border rounded-xl p-8 text-center mb-5">
            <div className="w-20 h-20 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Trophy size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-1">
              Quiz Complete!
            </h2>
            <p className="text-sm text-text-secondary mb-4">{quiz.title}</p>
            <div className="text-4xl font-black text-primary mb-2">
              {result.percentage}%
            </div>
            <p className="text-sm text-text-secondary">
              {result.score} out of {result.totalQuestions} correct
            </p>

            {/* Score bar */}
            <div className="w-full h-2 bg-border rounded-full mt-4">
              <div
                className={`h-2 rounded-full transition-all ${
                  result.percentage >= 70
                    ? "bg-accent"
                    : result.percentage >= 40
                      ? "bg-yellow-400"
                      : "bg-danger"
                }`}
                style={{ width: `${result.percentage}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="bg-background border border-border rounded-lg p-3">
                <p className="text-lg font-bold text-accent">{result.score}</p>
                <p className="text-xs text-text-secondary">Correct</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-3">
                <p className="text-lg font-bold text-danger">
                  {result.totalQuestions - result.score}
                </p>
                <p className="text-xs text-text-secondary">Wrong</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-3">
                <p className="text-lg font-bold text-secondary">
                  {formatTime(elapsed)}
                </p>
                <p className="text-xs text-text-secondary">Time</p>
              </div>
            </div>
          </div>

          {/* Answer Review */}
          <div className="bg-surface border border-border rounded-xl p-5 mb-5">
            <p className="text-sm font-semibold text-text-primary mb-4">
              Answer Review
            </p>
            <div className="flex flex-col gap-3">
              {result.gradedAnswers.map((ans, i) => (
                <div
                  key={i}
                  className={`border rounded-lg p-4 ${
                    ans.isCorrect
                      ? "border-green-200 bg-green-50/40"
                      : "border-red-200 bg-red-50/40"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {ans.isCorrect ? (
                      <CheckCircle
                        size={15}
                        className="text-accent shrink-0 mt-0.5"
                      />
                    ) : (
                      <XCircle
                        size={15}
                        className="text-danger shrink-0 mt-0.5"
                      />
                    )}
                    <p className="text-sm font-medium text-text-primary">
                      {result.questions[i].question}
                    </p>
                  </div>
                  <div className="ml-5 flex flex-col gap-1">
                    <p className="text-xs text-text-secondary">
                      Your answer:{" "}
                      <span
                        className={
                          ans.isCorrect
                            ? "text-accent font-medium"
                            : "text-danger font-medium"
                        }
                      >
                        {ans.selectedAnswer !== null
                          ? result.questions[i].options[ans.selectedAnswer]
                          : "Not answered"}
                      </span>
                    </p>
                    {!ans.isCorrect && (
                      <p className="text-xs text-text-secondary">
                        Correct answer:{" "}
                        <span className="text-accent font-medium">
                          {
                            result.questions[i].options[
                              result.questions[i].correctAnswer
                            ]
                          }
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sign in prompt for guests */}
          {!isAuthenticated && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center mb-5">
              <p className="text-sm text-text-primary mb-2">
                Sign in to save your score and track progress!
              </p>
              <Link
                to="/auth"
                className="text-xs bg-primary text-surface px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity inline-block"
              >
                Sign In / Register
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              to="/quizzes"
              className="flex-1 border border-border text-text-secondary py-2.5 rounded-lg text-sm text-center hover:border-primary hover:text-primary transition-all"
            >
              Browse Quizzes
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setCurrentQ(0);
                setAnswers(new Array(quiz.questions.length).fill(null));
                setSelectedAnswer(null);
                setResult(null);
                setElapsed(0);
                setError("");
              }}
              className="flex-1 bg-primary text-surface py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              Retry Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Taking Screen
  const question = quiz.questions[currentQ];
  const isLast = currentQ === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-sm font-semibold text-text-primary">
              {quiz.title}
            </h1>
            <p className="text-xs text-text-secondary">{quiz.category}</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-text-secondary bg-surface border border-border px-3 py-1.5 rounded-lg">
            <Clock size={14} /> {formatTime(elapsed)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-border rounded-full mb-1">
          <div
            className="h-1.5 bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-text-secondary mb-5">
          Question {currentQ + 1} of {quiz.questions.length}
        </p>

        {/* Question Card */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-4">
          <p className="text-base font-semibold text-text-primary mb-5 leading-relaxed">
            {question.question}
          </p>

          <div className="flex flex-col gap-3">
            {question.options.map((option, oIndex) => (
              <button
                key={oIndex}
                onClick={() => handleSelectAnswer(oIndex)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer ${
                  selectedAnswer === oIndex
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-border text-text-secondary hover:border-primary/50 hover:text-text-primary"
                }`}
              >
                <span className="font-medium mr-3 text-text-secondary">
                  {String.fromCharCode(65 + oIndex)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Question dots */}
        <div className="flex gap-1.5 flex-wrap justify-center mb-5">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentQ
                  ? "bg-primary scale-125"
                  : answers[i] !== null
                    ? "bg-secondary"
                    : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentQ === 0}
            className="flex-1 border border-border text-text-secondary py-2.5 rounded-lg text-sm hover:border-primary hover:text-primary transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-primary text-surface py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 bg-primary text-surface py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
            >
              Next <ChevronRight size={15} />
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-danger text-center mt-3">{error}</p>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
