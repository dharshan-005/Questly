import { Link } from "react-router-dom";
import { Play, HelpCircle, Users, BarChart2 } from "lucide-react";

const QuizCard = ({ quiz }) => {
  return (
    <div className="group bg-surface rounded-2xl border border-border p-5 hover:border-primary/50 hover:shadow-lg transition-all duration-300 w-full flex flex-col justify-between h-full">
      <div>
        {/* Category + Score bar */}
        <div className="flex justify-between items-start mb-3">
          <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-lg">
            {quiz.category || "General"}
          </span>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <BarChart2 size={12} className="text-primary/60" />
            <span>{quiz.averageScore ?? 0}% avg</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1 mb-1">
          {quiz.title}
        </h2>

        {/* Description */}
        <p className="text-xs text-text-secondary line-clamp-2">
          {quiz.description ||
            `Challenge yourself with this ${quiz.category?.toLowerCase() || "general"} quiz.`}
        </p>

        {/* Average score progress bar */}
        <div className="mt-3 h-1.5 bg-border rounded-full">
          <div
            className="h-1.5 bg-primary rounded-full transition-all"
            style={{ width: `${quiz.averageScore ?? 0}%` }}
          />
        </div>
      </div>

      <div className="mt-4">
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-text-secondary mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1.5">
            <HelpCircle size={14} className="text-primary/60" />
            <span className="font-medium text-text-primary">
              {quiz.questions?.length ?? 0}
            </span>{" "}
            Questions
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-primary/60" />
            <span className="font-medium text-text-primary">
              {quiz.totalAttempts ?? 0}
            </span>{" "}
            Attempts
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-text-secondary">
              By {quiz.createdBy?.name || "Anonymous"}
            </span>
          </div>
        </div>

        {/* Take Quiz Button */}
        <Link
          to={`/quiz/take/${quiz._id}`}
          className="flex items-center justify-center gap-2 w-full bg-primary text-surface py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <Play size={15} fill="currentColor" />
          Take Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;
