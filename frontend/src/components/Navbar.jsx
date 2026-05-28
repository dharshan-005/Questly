import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { User, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  // const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navLinkStyle = ({ isActive }) =>
    `relative pb-1 transition-colors hover:text-surface/80 ${
      isActive
        ? "after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-white"
        : ""
    }`;

  return (
    <nav className="bg-primary text-surface sticky top-0 z-50">
      <div className="flex justify-between items-center px-6 md:px-10 py-4">
        <Link to="/" className="text-xl font-semibold">
          Questly
        </Link>

        <div className="hidden md:flex gap-8 items-center text-sm">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/quizzes" className={navLinkStyle}>
            Quizzes
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/my-quizzes" className={navLinkStyle}>
                My Quizzes
              </NavLink>
              <NavLink to="/my-attempts" className={navLinkStyle}>
                My Attempts
              </NavLink>
              <NavLink
                to="/quiz/create"
                className="bg-accent text-surface py-1.5 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <PlusCircle size={14} /> Create Quiz
              </NavLink>
            </>
          )}

          {isAuthenticated ? (
            <NavLink to="/profile" className={navLinkStyle}>
              <User size={20} />
            </NavLink>
          ) : (
            <Link
              to="/auth"
              className="hover:text-surface/80 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-3">
          {isAuthenticated ? (
            // <>
            // <Link to="/profile" className="hover:opacity-80 transition-opacity">
            //   <User size={20} />
            // </Link>
            <Link
              to="/quiz/create"
              className="bg-accent text-surface py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <PlusCircle size={14} />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-sm hover:text-surface/80 transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
