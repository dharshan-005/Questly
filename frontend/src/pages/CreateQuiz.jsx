import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createQuiz } from "../services/quizService";
import { PlusCircle, Trash2, ChevronRight, X, ChevronLeft } from "lucide-react";

const categories = [
  "Development",
  "History",
  "Business",
  "Science",
  "Sports",
  "Tech",
  "General",
  "Other",
];

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
});

const CreateQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [details, setDetails] = useState({
    title: "",
    description: "",
    category: "General",
  });

  const [questions, setQuestions] = useState([emptyQuestion()]);

  const handleDetailsChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswer = (qIndex, oIndex) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = oIndex;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, emptyQuestion()]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const validateStep1 = () => {
    if (!details.title.trim()) {
      setError("Quiz title is required");
      return false;
    }
    if (!details.category) {
      setError("Please select a category");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = () => {
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        setError(`Question ${i + 1} text is required`);
        return false;
      }
      const filledOptions = questions[i].options.filter((o) => o.trim());
      if (filledOptions.length < 2) {
        setError(`Question ${i + 1} needs at least 2 options`);
        return false;
      }
      if (!questions[i].options[questions[i].correctAnswer]?.trim()) {
        setError(`Question ${i + 1} correct answer option is empty`);
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...details,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options.filter((o) => o.trim()),
          correctAnswer: q.correctAnswer,
        })),
      };
      const data = await createQuiz(payload, token);
      if (data.success) {
        setSuccess("Quiz created successfully!");
        setTimeout(() => navigate("/my-quizzes"), 1500);
      } else {
        setError(data.message || "Failed to create quiz");
      }
    } catch (err) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary bg-background focus:outline-none focus:border-primary transition-all placeholder:text-text-secondary/60";

  const labelClass = "block text-xs font-medium text-text-primary mb-1.5";

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-text-primary">Create a Quiz</h1>
          <p className="text-sm text-text-secondary mt-1">
            Build and publish your quiz in two steps
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-2 mb-6">
          <div
            className={`flex-1 h-1.5 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-border"}`}
          />
          <div
            className={`flex-1 h-1.5 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-border"}`}
          />
        </div>

        {/* Step 1 - Quiz Details */}
        {step === 1 && (
          <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4">
            <p className="text-sm font-semibold text-text-primary">
              Step 1 - Quiz Details
            </p>

            <div>
              <label className={labelClass}>Quiz Title</label>
              <input
                type="text"
                name="title"
                value={details.title}
                onChange={handleDetailsChange}
                placeholder="e.g. React Fundamentals"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Description
                <span className="text-text-secondary font-normal ml-1">
                  (optional)
                </span>
              </label>
              <textarea
                name="description"
                value={details.description}
                onChange={handleDetailsChange}
                placeholder="What is this quiz about?"
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                name="category"
                value={details.category}
                onChange={handleDetailsChange}
                className={inputClass + " cursor-pointer"}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-xs text-danger text-center">{error}</p>
            )}

            <button
              onClick={handleNext}
              className="bg-primary text-surface py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
            >
              Next - Add Questions <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Step 2 - Questions */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4"
              >
                {/* Question header */}
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-text-primary">
                    Question {qIndex + 1}
                  </p>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="text-danger text-xs flex items-center gap-1 hover:opacity-70 cursor-pointer"
                    >
                      <X size={13} /> Remove
                    </button>
                  )}
                </div>

                {/* Question text */}
                <div>
                  <label className={labelClass}>Question</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, e.target.value)
                    }
                    placeholder="Enter your question..."
                    className={inputClass}
                  />
                </div>

                {/* Options */}
                <div>
                  <label className={labelClass}>
                    Options -{" "}
                    <span className="text-text-secondary font-normal">
                      click the circle to mark correct answer
                    </span>
                  </label>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleCorrectAnswer(qIndex, oIndex)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                            q.correctAnswer === oIndex
                              ? "border-primary bg-primary"
                              : "border-border hover:border-primary"
                          }`}
                        >
                          {q.correctAnswer === oIndex && (
                            <div className="w-2 h-2 rounded-full bg-surface" />
                          )}
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(qIndex, oIndex, e.target.value)
                          }
                          placeholder={`Option ${oIndex + 1}`}
                          className={`flex-1 border rounded-lg px-3 py-2 text-sm text-text-primary bg-background focus:outline-none transition-all placeholder:text-text-secondary/60 ${
                            q.correctAnswer === oIndex
                              ? "border-primary bg-green-50/40"
                              : "border-border focus:border-primary"
                          }`}
                        />
                        {q.correctAnswer === oIndex && (
                          <span className="text-xs text-accent font-medium shrink-0">
                            ✓ Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Add question */}
            <button
              onClick={addQuestion}
              className="w-full border border-dashed border-border text-text-secondary py-3 rounded-xl text-sm flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              <PlusCircle size={15} /> Add Another Question
            </button>

            {error && (
              <p className="text-xs text-danger text-center">{error}</p>
            )}
            {success && (
              <p className="text-xs text-accent text-center">{success}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pb-5">
              <button
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                className="flex-1 border border-border text-text-secondary py-2.5 rounded-lg text-sm hover:border-primary hover:text-primary transition-all cursor-pointer"
              >
                <p className="flex items-center justify-center gap-2">
                  <ChevronLeft size={20} />
                  Back
                </p>
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-primary text-surface py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Publishing..." : "Publish Quiz"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;
