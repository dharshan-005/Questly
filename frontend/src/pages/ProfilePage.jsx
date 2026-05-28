import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Mail,
  Edit,
  Trophy,
  FileQuestion,
  Clock,
  Search,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getMyQuizzes } from "../services/quizService";
import { getMyAttempts } from "../services/attemptService";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [stats, setStats] = useState({
    quizzesCreated: 0,
    quizzesTaken: 0,
    avgScore: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const [quizzesData, attemptsData] = await Promise.all([
          getMyQuizzes(token),
          getMyAttempts(token),
        ]);

        const attempts = attemptsData.success ? attemptsData.attempts : [];
        const quizzes = quizzesData.success ? quizzesData.quizzes : [];

        const avgScore =
          attempts.length > 0
            ? Math.round(
                attempts.reduce((sum, a) => sum + a.percentage, 0) /
                  attempts.length,
              )
            : 0;

        setStats({
          quizzesCreated: quizzes.length,
          quizzesTaken: attempts.length,
          avgScore,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="bg-surface border border-border rounded-xl p-6 text-center mb-4">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-surface text-2xl font-bold mx-auto mb-3">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h1 className="text-lg font-bold text-text-primary">{user?.name}</h1>
          <p className="text-sm text-text-secondary flex items-center justify-center gap-1 mt-1">
            <Mail size={13} /> {user?.email}
          </p>
          <button className="mt-4 flex items-center gap-2 bg-background border border-border text-text-secondary px-4 py-2 rounded-lg text-sm hover:border-primary hover:text-primary transition-all cursor-pointer mx-auto">
            <Edit size={14} /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-primary">
              {loading ? "-" : stats.quizzesCreated}
            </p>
            <p className="text-xs text-text-secondary">Quizzes Created</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-accent">
              {loading ? "-" : stats.quizzesTaken}
            </p>
            <p className="text-xs text-text-secondary">Quizzes Taken</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-yellow-500">
              {loading ? "-" : `${stats.avgScore}%`}
            </p>
            <p className="text-xs text-text-secondary">Avg Score</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-text-primary mb-3">
            Quick Links
          </p>
          <div className="flex flex-col gap-2">
            {[
              {
                label: "My Quizzes",
                to: "/my-quizzes",
                icon: <FileQuestion size={15} />,
              },
              {
                label: "My Attempts",
                to: "/my-attempts",
                icon: <Clock size={15} />,
              },
              {
                label: "Leaderboard",
                to: "/leaderboard",
                icon: <Trophy size={15} />,
              },
              {
                label: "Browse Quizzes",
                to: "/quizzes",
                icon: <Search size={15} />,
              },
            ].map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className="flex items-center justify-between px-3 py-2.5 border border-border rounded-lg text-sm text-text-secondary hover:border-primary hover:text-primary transition-all"
              >
                <span className="flex items-center gap-2">
                  {link.icon} {link.label}
                </span>
                <span className="text-xs">→</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          {confirmLogout ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-text-primary text-center">
                Are you sure you want to sign out?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="flex-1 border border-border text-text-secondary py-2 rounded-lg text-sm hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-danger text-surface py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmLogout(true)}
              className="w-full flex items-center justify-center gap-2 text-danger border border-red-100 bg-red-50 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
            >
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// import { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import {
//   Home,
//   Search,
//   BookOpen,
//   User,
//   LogOut,
//   Mail,
//   Edit,
//   Trophy,
//   FileQuestion,
//   Clock,
//   Briefcase,
// } from "lucide-react";

// const ProfilePage = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [confirmLogout, setConfirmLogout] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate("/auth");
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-background pb-24 md:pb-8">
//         <div className="max-w-xl mx-auto px-4 py-6">
//           {/* Profile Card */}
//           <div className="bg-surface border border-border rounded-xl p-6 text-center mb-4">
//             <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-surface text-2xl font-bold mx-auto mb-3">
//               {user?.name?.charAt(0).toUpperCase() || "U"}
//             </div>
//             <h1 className="text-lg font-bold text-text-primary">
//               {user?.name}
//             </h1>
//             <p className="text-sm text-text-secondary flex items-center justify-center gap-1 mt-1">
//               <Mail size={13} /> {user?.email}
//             </p>
//             <button className="mt-4 flex items-center gap-2 bg-background border border-border text-text-secondary px-4 py-2 rounded-lg text-sm hover:border-primary hover:text-primary transition-all cursor-pointer mx-auto">
//               <Edit size={14} /> Edit Profile
//             </button>
//           </div>

//           {/* Quick Stats */}
//           <div className="grid grid-cols-3 gap-3 mb-4">
//             <div className="bg-surface border border-border rounded-xl p-3 text-center">
//               <p className="text-xl font-bold text-primary">0</p>
//               <p className="text-xs text-text-secondary">Quizzes Created</p>
//             </div>
//             <div className="bg-surface border border-border rounded-xl p-3 text-center">
//               <p className="text-xl font-bold text-accent">0</p>
//               <p className="text-xs text-text-secondary">Quizzes Taken</p>
//             </div>
//             <div className="bg-surface border border-border rounded-xl p-3 text-center">
//               <p className="text-xl font-bold text-yellow-500">0%</p>
//               <p className="text-xs text-text-secondary">Avg Score</p>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="bg-surface border border-border rounded-xl p-4 mb-4">
//             <p className="text-sm font-semibold text-text-primary mb-3">
//               Quick Links
//             </p>
//             <div className="flex flex-col gap-2">
//               {[
//                 {
//                   label: "My Quizzes",
//                   to: "/my-quizzes",
//                   icon: <FileQuestion size={15} />,
//                 },
//                 {
//                   label: "My Attempts",
//                   to: "/my-attempts",
//                   icon: <Clock size={15} />,
//                 },
//                 {
//                   label: "Leaderboard",
//                   to: "/leaderboard",
//                   icon: <Trophy size={15} />,
//                 },
//                 {
//                   label: "Browse Quizzes",
//                   to: "/quizzes",
//                   icon: <Search size={15} />,
//                 },
//               ].map((link) => (
//                 <NavLink
//                   key={link.label}
//                   to={link.to}
//                   className="flex items-center justify-between px-3 py-2.5 border border-border rounded-lg text-sm text-text-secondary hover:border-primary hover:text-primary transition-all"
//                 >
//                   <span className="flex items-center gap-2">
//                     {link.icon} {link.label}
//                   </span>
//                   <span className="text-xs">→</span>
//                 </NavLink>
//               ))}
//             </div>
//           </div>

//           {/* Logout */}
//           <div className="bg-surface border border-border rounded-xl p-4">
//             {confirmLogout ? (
//               <div className="flex flex-col gap-3">
//                 <p className="text-sm text-text-primary text-center">
//                   Are you sure you want to sign out?
//                 </p>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setConfirmLogout(false)}
//                     className="flex-1 border border-border text-text-secondary py-2 rounded-lg text-sm hover:border-primary hover:text-primary transition-all cursor-pointer"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     className="flex-1 bg-danger text-surface py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
//                   >
//                     Yes, Sign Out
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setConfirmLogout(true)}
//                 className="w-full flex items-center justify-center gap-2 text-danger border border-red-100 bg-red-50 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
//               >
//                 <LogOut size={16} /> Sign Out
//               </button>
//             )}
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

// export default ProfilePage;
