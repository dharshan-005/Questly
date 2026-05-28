import { useState, useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";

import { getAllQuizzes } from "../services/quizService";
import QuizCard from "../components/QuizCard";

const categories = [
  "All",
  "Science",
  "History",
  "Sports",
  "Tech",
  "Business",
  "Development",
  "General",
];

const Quizzes = () => {
  const [searchParams] = useSearchParams();

  const [quizzes, setQuizzes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [active, setActive] = useState("All");

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const data = await getAllQuizzes(search, active);
        if (data.success) setQuizzes(data.quizzes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [search, active]);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="flex items-center justify-center flex-col p-6 pb-5 gap-4 bg-primary/5 border-b border-border">
        <div className="flex items-center gap-3 w-full md:w-96 bg-surface border border-border rounded-xl px-4 py-2.5 focus-within:border-primary transition-all">
          <Search size={16} className="text-text-secondary shrink-0" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-sm text-text-primary placeholder:text-text-secondary/60"
          />
          {search && (
            <button onClick={() => setSearch("")} className="cursor-pointer">
              <X size={14} className="text-text-secondary" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-3 py-1 rounded-full border text-xs transition-all cursor-pointer ${
                active === cat
                  ? "bg-primary text-surface border-primary"
                  : "bg-surface border-border text-text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5">
        <p className="text-sm text-text-secondary mb-4">
          {loading
            ? "Loading..."
            : `${quizzes.length} quiz${quizzes.length !== 1 ? "zes" : ""} found`}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-36 bg-surface border border-border rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-text-primary mb-2">
              No quizzes found
            </p>
            <p className="text-xs text-text-secondary mb-4">
              Try a different search or category
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActive("All");
              }}
              className="text-xs text-primary hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;

// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { BookOpen, Briefcase, Home, Search, User } from "lucide-react";

// import QuizCard from "../components/QuizCard";

// const quizzes = [
//   {
//     id: 1,
//     title: "React Fundamentals",
//     category: "Development",
//     questions: 10,
//     plays: 1200,
//   },
//   {
//     id: 2,
//     title: "World History 101",
//     category: "History",
//     questions: 15,
//     plays: 850,
//   },
//   {
//     id: 3,
//     title: "Marketing Basics",
//     category: "Business",
//     questions: 8,
//     plays: 430,
//   },
// ];

// const tagLine = [
//   {
//     id: 1,
//     heading: "All",
//   },
//   {
//     id: 2,
//     heading: "Science",
//   },
//   {
//     id: 3,
//     heading: "History",
//   },
//   {
//     id: 4,
//     heading: "Sports",
//   },
//   {
//     id: 5,
//     heading: "Tech",
//   },
// ];

// const Quizzes = () => {
//   const [active, setActive] = useState("All");

//   return (
//     <>
//       <div className="min-h-screen ">
//         <div className="flex items-center justify-center flex-col p-10 pb-6 gap-4 bg-primary/5">
//           <div className="flex items-center gap-3 md:w-80 bg-surface border border-border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
//             <input
//               type="text"
//               name="text"
//               placeholder="Search Quizzes..."
//               className="w-full outline-none bg-transparent text-text-primary"
//             />
//             <Search />
//           </div>

//           <div className="flex flex-wrap justify-center gap-3">
//             {tagLine.map((tags) => (
//               <p
//                 key={tags.id}
//                 onClick={() => setActive(tags.heading)}
//                 className={`px-3 py-1 rounded-full border border-border text-text-secondary hover:bg-primary hover:text-white transition text-xs ${active === tags.heading ? "bg-primary text-white" : "bg-surface"} cursor-pointer`}
//               >
//                 {tags.heading}
//               </p>
//             ))}
//           </div>
//         </div>

//         <div className="min-h-auto py-5 border-t border-border flex flex-col justify-center items-center">
//           <div className="flex justify-center flex-col gap-3">
//             <p>3 quizzes available</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {quizzes.map((quiz) => (
//                 <QuizCard key={quiz.id} quiz={quiz} />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Mobile Bottom Nav */}
//         <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex md:hidden justify-around py-3 z-50">
//           {[
//             { icon: <Home size={20} />, label: "Home", to: "/" },
//             { icon: <Search size={20} />, label: "Quizzes", to: "/quizzes" },
//             {
//               icon: <Briefcase size={20} />,
//               label: "My Quizzes",
//               to: "/my-quizzes",
//             },
//             {
//               icon: <BookOpen size={20} />,
//               label: "My Attempts",
//               to: "/my-attempts",
//             },
//             { icon: <User size={20} />, label: "Profile", to: "/profile" },
//           ].map((item) => (
//             <NavLink
//               key={item.label}
//               to={item.to}
//               className={({ isActive }) =>
//                 `relative flex flex-col items-center gap-1 pt-2 transition-colors ${
//                   isActive
//                     ? "text-primary before:absolute before:-top-3 before:left-0 before:w-full before:h-0.5 before:bg-primary"
//                     : "text-text-secondary hover:text-primary"
//                 }`
//               }
//             >
//               {item.icon}
//               <span className="text-xs">{item.label}</span>
//             </NavLink>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Quizzes;
