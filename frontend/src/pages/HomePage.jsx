import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllQuizzes } from "../services/quizService";
import {
  PlusCircle,
  Play,
  CheckCircle,
  Zap,
  BarChart3,
  Users,
  ArrowRight,
} from "lucide-react";

const HomePage = () => {
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllQuizzes();
        if (data.success) setFeaturedQuizzes(data.quizzes.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary pb-24 md:pb-0">
      {/* Hero */}
      <section className="relative px-6 py-12 md:py-16 max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6">
          <Zap size={14} /> The #1 Quiz Maker
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5 max-w-3xl leading-tight">
          Master any subject with{" "}
          <span className="text-primary">interactive</span> quizzes.
        </h1>
        <p className="text-base md:text-lg text-text-secondary max-w-xl mb-8 leading-relaxed">
          Create custom quizzes in minutes, challenge your friends, and track
          your progress with real-time analytics.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            to="/quiz/create"
            className="flex items-center justify-center gap-2 bg-primary text-surface px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <PlusCircle size={18} /> Create a Quiz
          </Link>
          <Link
            to="/quizzes"
            className="flex items-center justify-center gap-2 bg-surface border border-border px-7 py-3.5 rounded-xl font-semibold text-sm hover:border-primary hover:text-primary transition-all"
          >
            <Play size={18} /> Browse Quizzes
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-10 w-full">
          {[
            { value: "10k+", label: "Active Quizzes" },
            { value: "50k+", label: "Students" },
            { value: "1M+", label: "Answers Given" },
            { value: "99%", label: "Satisfaction" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-text-primary">
                {s.value}
              </span>
              <span className="text-xs text-text-secondary">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Quizzes */}
      <section className="bg-surface py-14 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-1">
                Featured Quizzes
              </h2>
              <p className="text-sm text-text-secondary">
                Hand-picked by our community
              </p>
            </div>
            <Link
              to="/quizzes"
              className="hidden md:flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-background border border-border rounded-xl p-5 animate-pulse h-36"
                />
              ))}
            </div>
          ) : featuredQuizzes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-text-secondary mb-3">
                No quizzes yet - be the first!
              </p>
              <Link to="/auth" className="text-sm text-primary hover:underline">
                Sign up to create one
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {featuredQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="group bg-background border border-border p-5 rounded-xl hover:border-primary transition-all hover:shadow-sm cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                      {quiz.category}
                    </span>
                    <div className="flex items-center gap-1 text-text-secondary text-xs">
                      <Users size={12} /> {quiz.totalAttempts}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors">
                    {quiz.title}
                  </h3>

                  {/* Average score bar */}
                  <div className="h-1.5 bg-border rounded-full mb-3">
                    <div
                      className="h-1.5 bg-primary rounded-full transition-all"
                      style={{ width: `${quiz.averageScore || 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      {quiz.questions?.length || 0} questions
                    </span>
                    <Link
                      to={`/quiz/take/${quiz._id}`}
                      className="text-xs bg-primary text-surface px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Start
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-12">
          Simple as 1-2-3
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <PlusCircle size={28} />,
              title: "Build your Quiz",
              desc: "Create multiple-choice questions with ease using our intuitive editor.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: <Users size={28} />,
              title: "Share with Anyone",
              desc: "Send a simple link to your students, employees, or friends.",
              color: "bg-purple-50 text-purple-600",
            },
            {
              icon: <BarChart3 size={28} />,
              title: "Get Results",
              desc: "Receive immediate feedback and detailed score reports after every completion.",
              color: "bg-green-50 text-green-600",
            },
          ].map((step) => (
            <div key={step.title} className="flex flex-col items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${step.color}`}
              >
                {step.icon}
              </div>
              <h3 className="text-base font-semibold text-text-primary">
                {step.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary mx-4 md:mx-auto max-w-4xl rounded-2xl p-8 text-center mb-12">
        <h2 className="text-xl font-bold text-surface mb-2">
          Ready to test your knowledge?
        </h2>
        <p className="text-surface/70 text-sm mb-6">
          Join thousands of learners already using Trivora.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 bg-surface text-primary px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Get Started Free <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
