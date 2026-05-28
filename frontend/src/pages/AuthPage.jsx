import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/authService";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);

    try {
      const { ok, data } =
        mode === "login"
          ? await loginUser(formData.email, formData.password)
          : await registerUser(
              formData.name,
              formData.email,
              formData.password,
            );

      if (!ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      login(data.token, data.user);
      setFormData({ name: "", email: "", password: "" });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48" />

        <div className="relative z-10 max-w-md">
          <div className="mb-8">
            {/* <div className="w-12 h-1 bg-white mb-4 rounded-full" /> */}
            <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">
              Questly
            </h1>
            <p className="text-white/80 text-lg">
              The intelligent way to evaluate talent and knowledge.
            </p>
          </div>

          <div className="space-y-6">
            {[
              "Real-time quiz analytics",
              "Automated grading system",
              "Secure candidate environment",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <CheckCircle2 className="text-white/60" size={20} />
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden text-center">
            <h1 className="text-3xl font-bold text-primary">Questly</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-text-primary">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-text-secondary mt-2">
              {mode === "login"
                ? "Enter your credentials to access your dashboard."
                : "Join thousands of creators and students today."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-secondary">
                  Full Name
                </label>
                <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                  <User size={18} className="text-text-secondary" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent text-text-primary"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-text-secondary">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <Mail size={18} className="text-text-secondary" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-text-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-text-secondary">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <Lock size={18} className="text-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-text-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? (
                    <FaEye size={18} />
                  ) : (
                    <FaEyeSlash size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* {mode === "register" && (
              <div className="space-y-3 pt-2">
                <p className="text-sm font-semibold text-text-secondary">
                  I want to...
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("taker")}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
                      role === "taker"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-text-secondary hover:border-text-secondary"
                    }`}
                  >
                    Take quizzes
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("employer")}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
                      role === "employer"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-text-secondary hover:border-text-secondary"
                    }`}
                  >
                    Create quizzes
                  </button>
                </div>
              </div>
            )} */}

            {error && (
              <p className="text-sm text-danger font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-text-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-slate-200"
            >
              {loading
                ? "Loading..."
                : mode === "login"
                  ? "Sign In"
                  : "Get Started"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-text-secondary font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-border py-3.5 rounded-xl font-semibold text-text-primary hover:bg-surface transition-all cursor-pointer"
            >
              <FcGoogle size={20} /> Google
            </button>

            <p className="text-center text-sm text-text-secondary pt-4">
              {mode === "login" ? "New to Questly?" : "Have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-primary font-bold hover:underline"
              >
                {mode === "login" ? "Create an account" : "Sign in instead"}
              </button>
            </p>

            <div className="flex justify-center pt-2">
              <Link
                to="/"
                className="text-xs font-medium text-text-secondary hover:text-text-primary flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
