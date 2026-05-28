import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllQuizzes } from "../services/quizService";
import { getMyAttempts } from "../services/attemptService";
import {
  PlusCircle,
  Trophy,
  Clock,
  BookOpen,
  ArrowRight,
  Users,
} from "lucide-react";

const LoggedInHome = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [quizzesData, attemptsData] = await Promise.all([
          getAllQuizzes(),
          getMyAttempts(token),
        ]);
        if (quizzesData.success) setQuizzes(quizzesData.quizzes);
        if (attemptsData.success) setAttempts(attemptsData.attempts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const avgScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length,
        )
      : 0;

  const recentAttempts = attempts.slice(0, 3);
  const recommendedQuizzes = quizzes.slice(0, 4);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Welcome */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-text-primary">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Ready to challenge yourself today?
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-primary">
              {loading ? "-" : attempts.length}
            </p>
            <p className="text-xs text-text-secondary">Quizzes Taken</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-accent">
              {loading ? "-" : `${avgScore}%`}
            </p>
            <p className="text-xs text-text-secondary">Avg Score</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-secondary">
              {loading ? "-" : quizzes.length}
            </p>
            <p className="text-xs text-text-secondary">Available</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          <Link
            to="/quiz/create"
            className="bg-primary text-surface px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <PlusCircle size={17} /> Create New Quiz
          </Link>
          <Link
            to="/quizzes"
            className="bg-surface border border-border text-text-primary px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2 hover:border-primary hover:text-primary transition-all"
          >
            <BookOpen size={17} /> Browse All Quizzes
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-5">
          {/* Recommended Quizzes */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-semibold text-text-primary">
                Recommended for You
              </p>
              <Link
                to="/quizzes"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-background rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : recommendedQuizzes.length === 0 ? (
              <p className="text-xs text-text-secondary text-center py-6">
                No quizzes yet
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {recommendedQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="border border-border rounded-lg p-3 flex justify-between items-center hover:border-primary/40 transition-all"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {quiz.title}
                      </p>
                      <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                        <Users size={11} /> {quiz.totalAttempts} attempts ·{" "}
                        {quiz.questions?.length} questions
                      </p>
                    </div>
                    <Link
                      to={`/quiz/take/${quiz._id}`}
                      className="text-xs bg-primary text-surface px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity shrink-0"
                    >
                      Start
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Attempts */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Clock size={14} /> Recent Attempts
                </p>
                <Link
                  to="/my-attempts"
                  className="text-xs text-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <div className="flex flex-col gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-background rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : recentAttempts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-text-secondary mb-2">
                    No attempts yet
                  </p>
                  <Link
                    to="/quizzes"
                    className="text-xs text-primary hover:underline"
                  >
                    Take your first quiz
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recentAttempts.map((attempt) => (
                    <div
                      key={attempt._id}
                      className="border border-border rounded-lg p-3 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-xs font-medium text-text-primary">
                          {attempt.quiz?.title}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {new Date(attempt.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          attempt.percentage >= 70
                            ? "bg-green-50 text-green-700"
                            : attempt.percentage >= 40
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {attempt.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Leaderboard teaser */}
            <div className="bg-surface border border-border rounded-xl p-4 text-center">
              <Trophy size={24} className="text-yellow-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-text-primary mb-1">
                Leaderboard
              </p>
              <p className="text-xs text-text-secondary mb-3">
                See how you rank against others
              </p>
              <Link
                to="/quizzes"
                className="text-xs bg-primary text-surface px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity inline-block"
              >
                View Rankings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoggedInHome;
