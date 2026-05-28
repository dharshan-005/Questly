const BASE_URL = "http://localhost:5000/api/auth";

export const registerUser = async (name, email, password, role) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, role }),
  });
  return response.json().then((data) => ({ ok: response.ok, data }));
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json().then((data) => ({ ok: response.ok, data }));
};

export const profile = async (token) => {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      //   "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json().then((data) => ({ ok: response.ok, data }));
};
