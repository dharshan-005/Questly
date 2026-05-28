const BASE_URL = "http://localhost:5000/api/attempts";

// Submit a quiz attempt
export const submitAttempt = async (quizId, attemptData, token) => {
  const response = await fetch(`${BASE_URL}/${quizId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(attemptData),
  });
  return response.json();
};

// Get all attempts by logged in user
export const getMyAttempts = async (token) => {
  const response = await fetch(`${BASE_URL}/my-attempts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Get all attempts for a specific quiz — creator only
export const getQuizAttempts = async (quizId, token) => {
  const response = await fetch(`${BASE_URL}/quiz/${quizId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Get leaderboard for a quiz
export const getLeaderboard = async (quizId) => {
  const response = await fetch(`${BASE_URL}/leaderboard/${quizId}`);
  return response.json();
};
