import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Trophy, RotateCcw } from "lucide-react";

import { getMyAttempts } from "../services/attemptService";

const MyAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getMyAttempts(token);
        if (data.success) setAttempts(data.attempts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const avgScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length,
        )
      : 0;

  const best = attempts.reduce(
    (max, a) => (a.percentage > max ? a.percentage : max),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-text-primary">My Attempts</h1>
          <p className="text-sm text-text-secondary mt-1">
            {attempts.length} quiz{attempts.length !== 1 ? "zes" : ""} attempted
          </p>
        </div>

        {attempts.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-surface border border-border rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-primary">
                {attempts.length}
              </p>
              <p className="text-xs text-text-secondary">Total Attempts</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-accent">{avgScore}%</p>
              <p className="text-xs text-text-secondary">Average Score</p>
            </div>
            <div className="bg-surface border border-border rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-yellow-500">{best}%</p>
              <p className="text-xs text-text-secondary">Best Score</p>
            </div>
          </div>
        )}

        {attempts.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-10 text-center">
            <Trophy size={32} className="text-text-secondary mx-auto mb-3" />
            <p className="text-sm font-medium text-text-primary mb-2">
              No attempts yet
            </p>
            <p className="text-xs text-text-secondary mb-4">
              Take your first quiz and see how you score
            </p>
            <Link
              to="/quizzes"
              className="text-xs text-primary hover:underline"
            >
              Browse Quizzes
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {attempts.map((attempt) => (
              <div
                key={attempt._id}
                className="bg-surface border border-border rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:border-primary/30 transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {attempt.quiz?.title}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {attempt.quiz?.category}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(attempt.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {attempt.score}/{attempt.totalQuestions} correct
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                      attempt.percentage >= 70
                        ? "bg-green-50 text-green-700"
                        : attempt.percentage >= 40
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {attempt.percentage}%
                  </span>
                  <Link
                    to={`/quiz/take/${attempt.quiz?._id}`}
                    className="flex items-center gap-1.5 border border-border text-text-secondary px-3 py-1.5 rounded-lg text-xs hover:border-primary hover:text-primary transition-all"
                  >
                    <RotateCcw size={13} /> Retry
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttempts;
