import { NavLink } from "react-router-dom";
import { Home, Search, Briefcase, BookOpen, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { icon: <Home size={20} />, label: "Home", to: "/", public: true },
  {
    icon: <Search size={20} />,
    label: "Quizzes",
    to: "/quizzes",
    public: true,
  },
  {
    icon: <Briefcase size={20} />,
    label: "My Quizzes",
    to: "/my-quizzes",
    public: false,
  },
  {
    icon: <BookOpen size={20} />,
    label: "Attempts",
    to: "/my-attempts",
    public: false,
  },
  { icon: <User size={20} />, label: "Profile", to: "/profile", public: false },
];

const MobileNav = () => {
  const { isAuthenticated } = useAuth();

  const visibleItems = navItems.filter(
    (item) => item.public || isAuthenticated,
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex md:hidden justify-around py-3 z-50">
      {visibleItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 pt-2 transition-colors ${
              isActive
                ? "text-primary before:absolute before:-top-3 before:left-0 before:w-full before:h-0.5 before:bg-primary"
                : "text-text-secondary hover:text-primary"
            }`
          }
        >
          {item.icon}
          <span className="text-xs">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
