import React from "react";
import { Link } from "react-router-dom";
import { Play, HelpCircle, Users, Star } from "lucide-react";

const QuizCard = ({ quiz }) => {
  return (
    <div className="group bg-surface rounded-2xl border border-border p-5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 w-full flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg">
            {quiz.category || "General"}
          </span>
          <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-lg text-xs font-bold">
            <Star size={12} fill="currentColor" />
            <span>4.5</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
          {quiz.title}
        </h2>
        <p className="text-sm text-text-secondary mt-1 line-clamp-2">
          Challenge yourself with this {quiz.category.toLowerCase()} quiz.
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-4 text-text-secondary text-sm mb-5 pb-5 border-b border-border/50">
          <div className="flex items-center gap-1.5">
            <HelpCircle size={16} className="text-primary/60" />
            <span className="font-medium text-text-primary">
              {quiz.questions?.length}
            </span>{" "}
            Questions
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-primary/60" />
            <span className="font-medium text-text-primary">
              {quiz.plays}
            </span>{" "}
            Plays
          </div>
        </div>

        <Link
          to="/take-quiz"
          className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <Play size={16} fill="currentColor" />
          Take Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;

// import React from "react";
// import { Link } from "react-router-dom";

// const QuizCard = ({ quiz }) => {
//   return (
//     <>
//       <div className="bg-surface rounded-xl border border-border p-4 hover:shadow-md transition w-187.5">
//         <div className="flex justify-between">
//           <div className="flex flex-col">
//             <h2 className="text-lg font-semibold">{quiz.title}</h2>
//             <p className="text-sm text-text-secondary">{quiz.category}</p>
//           </div>
//           <p className="border rounded-md flex items-center px-2 h-7 text-xs">4.5 ⭐</p>
//         </div>

//         <div className="flex justify-between items-center mt-3 text-sm">
//           <span>{quiz.questions} Questions</span>
//           .
//           <span>{quiz.plays} Plays</span>
//           .
//         {/* </div>

//         <div className="flex justify-end"> */}
//           <button className="bg-primary text-white p-2 rounded-lg">
//             <Link to={"/take-quiz"}>Take Quiz</Link>
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default QuizCard;
