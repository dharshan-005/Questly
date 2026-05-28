import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Trash2, Clock, Users } from "lucide-react";

import { getMyQuizzes, deleteQuiz } from "../services/quizService";

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getMyQuizzes(token);
        if (data.success) setQuizzes(data.quizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const data = await deleteQuiz(id, token);
      if (data.success) {
        setQuizzes((prev) => prev.filter((q) => q._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

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
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-xl font-bold text-text-primary">My Quizzes</h1>
            <p className="text-sm text-text-secondary mt-1">
              {quizzes.length} quiz{quizzes.length !== 1 ? "zes" : ""} created
            </p>
          </div>
          <Link
            to="/quiz/create"
            className="bg-primary text-surface px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <PlusCircle size={15} /> New Quiz
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-10 text-center">
            <p className="text-sm font-medium text-text-primary mb-2">
              No quizzes created yet
            </p>
            <p className="text-xs text-text-secondary mb-4">
              Create your first quiz and share it with the world
            </p>
            <Link
              to="/quiz/create"
              className="text-xs text-primary hover:underline"
            >
              Create a Quiz
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-surface border border-border rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-primary/30 transition-all"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {quiz.title}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {quiz.category}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <Users size={11} /> {quiz.totalAttempts} attempts
                    </span>
                    <span className="text-xs text-text-secondary flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(quiz.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                      {quiz.questions?.length} questions
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        quiz.isPublished
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {quiz.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {confirmId === quiz._id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-secondary">Sure?</span>
                      <button
                        onClick={() => handleDelete(quiz._id)}
                        disabled={deletingId === quiz._id}
                        className="bg-danger text-surface px-3 py-1.5 rounded-lg text-xs hover:opacity-90 cursor-pointer disabled:opacity-60"
                      >
                        {deletingId === quiz._id ? "Deleting..." : "Yes"}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="border border-border text-text-secondary px-3 py-1.5 rounded-lg text-xs hover:border-primary hover:text-primary cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(quiz._id)}
                      className="flex items-center gap-1.5 bg-red-50 text-danger border border-red-100 px-3 py-1.5 rounded-lg text-xs hover:opacity-80 cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQuizzes;
