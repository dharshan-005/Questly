const BASE_URL = "http://localhost:5000/api/quizzes";

// Get all published quizzes — optional search and category filter
export const getAllQuizzes = async (search = "", category = "") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category && category !== "All") params.append("category", category);

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  return response.json();
};

// Get single quiz with questions
export const getSingleQuiz = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  return response.json();
};

// Get quizzes created by logged in user
export const getMyQuizzes = async (token) => {
  const response = await fetch(`${BASE_URL}/my-quizzes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Create a new quiz
export const createQuiz = async (quizData, token) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(quizData),
  });
  return response.json();
};

// Update a quiz
export const updateQuiz = async (id, quizData, token) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(quizData),
  });
  return response.json();
};

// Delete a quiz
export const deleteQuiz = async (id, token) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
