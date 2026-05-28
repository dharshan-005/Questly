# Questly

A full-stack online quiz platform where users can create quizzes, take quizzes, and track their scores — built with React, Node.js, and MongoDB.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Seeding Sample Data](#seeding-sample-data)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

Trivora is a modern quiz maker web application where any registered user can both **create** and **take** quizzes. Unlike role-based platforms, every user on Trivora has full access to create their own quizzes and attempt others — making it a community-driven knowledge platform.

---

## Features

### 👤 Authentication
- JWT-based secure login and registration
- Single user type — everyone can create and take quizzes
- Token verification on every page refresh
- Auto logout on token expiry

### 📝 Quiz Creation
- Multi-step quiz creation form
- Add multiple questions with up to 6 options each
- Mark correct answer visually by clicking
- Category selection
- Publish/draft toggle
- Delete quiz with confirmation

### 🎯 Quiz Taking
- Browse and search quizzes by title or category
- Filter by category pills
- Live timer while taking quiz
- Navigate between questions freely
- Answer memory — go back and change answers
- Submit → instant results with score, time taken
- Full answer review with correct/wrong breakdown
- Guests can take quizzes — score graded locally
- Registered users have scores saved to DB

### 📊 Progress Tracking
- My Attempts page — all past quiz attempts
- Stats — total attempts, average score, best score
- Retry any quiz directly from attempts page

### 🏆 Leaderboard
- Top 10 scores per quiz
- Sorted by score descending, time ascending

### 📱 Mobile Responsive
- Fully responsive across all screen sizes
- Sticky navbar
- Mobile bottom navigation bar
- Mobile-first design with shared `MobileNav` component

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Lucide React | Icons |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin requests |
| dotenv | Environment variables |

---

## Folder Structure

```
frontend/                        # React Frontend
   ├── public/
   ├── src/
   │   ├── components/
   │   │   ├── Navbar.jsx
   │   │   ├── Footer.jsx
   │   │   ├── MobileNav.jsx
   │   │   ├── QuizCard.jsx
   │   │   └── MainLayout.jsx
   │   ├── context/
   │   │   └── AuthContext.jsx
   │   ├── pages/
   │   │   ├── Home.jsx
   │   │   ├── HomePage.jsx
   │   │   ├── LoggedInHome.jsx
   │   │   ├── AuthPage.jsx
   │   │   ├── Quizzes.jsx
   │   │   ├── CreateQuiz.jsx
   │   │   ├── TakeQuiz.jsx
   │   │   ├── MyQuizzes.jsx
   │   │   ├── MyAttempts.jsx
   │   │   └── ProfilePage.jsx
   │   ├── services/
   │   │   ├── authService.js
   │   │   ├── quizService.js
   │   │   └── attemptService.js
   │   ├── App.jsx
   │   ├── main.jsx
   │   └── index.css
   ├── index.html
   └── vite.config.js

backend/                         # Node.js Backend
   ├── config/
   │   └── db.js
   ├── controllers/
   │   ├── authController.js
   │   ├── quizController.js
   │   └── attemptController.js
   ├── middleware/
   │   └── authMiddleware.js
   ├── models/
   │   ├── User.js
   │   ├── Quiz.js
   │   └── Attempt.js
   ├── routes/
   │   ├── authRoutes.js
   │   ├── quizRoutes.js
   │   └── attemptRoutes.js
   ├── .env
   └── server.js
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account or local MongoDB
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/dharshan-005/questly.git
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

Start the backend server:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Setup the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5175` Change according to your localhost port

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port for backend server | ✅ |
| `MONGO_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret key for JWT signing | ✅ |
| `JWT_EXPIRES_IN` | JWT expiry duration e.g. `7d` | ✅ |

---

## API Routes

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| GET | `/me` | Private | Get current user |

### Quizzes — `/api/quizzes`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all published quizzes |
| GET | `/my-quizzes` | Private | Get quizzes created by me |
| GET | `/:id` | Public | Get single quiz with questions |
| POST | `/` | Private | Create new quiz |
| PUT | `/:id` | Private | Update quiz (creator only) |
| DELETE | `/:id` | Private | Delete quiz + attempts (creator only) |

### Attempts — `/api/attempts`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/:quizId` | Private | Submit quiz attempt |
| GET | `/my-attempts` | Private | Get my attempts |
| GET | `/quiz/:quizId` | Private | Get all attempts for a quiz (creator only) |
| GET | `/leaderboard/:quizId` | Public | Top 10 scores for a quiz |

---

## Seeding Sample Data

A `quizzes_seed.json` file is included with 10 sample quizzes across 6 categories.

### Steps to Import

1. Register an account in the app at `/auth`
2. Go to **MongoDB Atlas** → your cluster → Collections → `users`
3. Copy your user's `_id`
4. Open `quizzes_seed.json` and add `"createdBy": { "$oid": "your_id_here" }` to each quiz
5. Go to the `quizzes` collection → **Insert Documents** → paste the JSON

---

## Color System

Trivora uses CSS variables with Tailwind v4 `@theme` for consistent theming:

```css
:root {
  --primary: #7C3AED;
  --secondary: #D946EF;
  --accent: #F59E0B;
  --background: #FAF5FF;
  --surface: #FFFFFF;
  --text-primary: #1E1B4B;
  --text-secondary: #6B7280;
  --border: #EDE9FE;
  --success: #22C55E;
  --danger: #EF4444;
}
```

---

## Screenshots

> Add screenshots here after deployment

| Page | Description |
|------|-------------|
| Public Home | Landing page with featured quizzes |
| Logged In Home | Personalized dashboard with stats |
| Quiz Listing | Browse and filter all quizzes |
| Create Quiz | Multi-step quiz builder |
| Take Quiz | Question by question with timer |
| Results | Score breakdown with answer review |
| My Quizzes | Manage created quizzes |
| My Attempts | Track past quiz scores |
| Profile | Stats + logout |

---

## Future Improvements

- [ ] Time limit per quiz set by creator
- [ ] Image support in questions
- [ ] Share quiz via link
- [ ] Real-time leaderboard with WebSockets
- [ ] Quiz categories management
- [ ] Dark mode
- [ ] OAuth — Google Sign In
- [ ] Email verification

---

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## Author

Built with ❤️ as part of a full-stack development internship project.

> Feel free to fork, star ⭐, and contribute!
