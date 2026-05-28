import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import Quizzes from "./pages/Quizzes";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import MyQuizzes from "./pages/MyQuizzes";
import MyAttempts from "./pages/MyAttempts";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text-secondary text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
      />

      {/* All other routes — wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/take/:id" element={<TakeQuiz />} />
        <Route
          path="/quiz/create"
          element={
            <ProtectedRoute>
              <CreateQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-quizzes"
          element={
            <ProtectedRoute>
              <MyQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-attempts"
          element={
            <ProtectedRoute>
              <MyAttempts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
