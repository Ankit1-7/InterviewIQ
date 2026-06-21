# InterviewIQ 🚀

InterviewIQ is an advanced AI-powered mock interview web application built on the MERN stack. It conducts realistic, conversational voice interviews, parses resumes, provides detailed performance reports, and features an integrated credit-based billing system.

---

## 🏗️ Architecture & How It Works

The application follows a client-server architecture:

```
┌──────────────────┐               ┌──────────────────┐
│  React Frontend  │ ◄───────────► │   Node Backend   │
│     (Client)     │  HTTP/JSON    │     (Server)     │
└────────┬─────────┘               └────────┬─────────┘
         │                                  │
   ┌─────┴─────┐                      ┌─────┴─────┐
   │ Firebase  │                      │  MongoDB  │ (Database)
   │  (Auth)   │                      │  Database │
   └───────────┘                      └─────┬─────┘
                                            │
                                      ┌─────┴─────┐
                                      │OpenRouter │ (AI Evaluation)
                                      └─────┬─────┘
                                            │
                                      ┌─────┴─────┐
                                      │ Razorpay  │ (Payments)
                                      └───────────┘
```

### 1. Authentication (Firebase + JWT)
* Users log in using Google Authentication via Firebase on the frontend.
* The frontend sends the user details to the backend `/api/auth/google`, which generates a secure JSON Web Token (JWT).
* This JWT is stored in an `httpOnly`, secure cookie named `token`, which automatically authenticates subsequent requests securely.

### 2. Resume Parsing & Setup
* Candidates upload their resume (PDF format) under **Interview Setup**.
* The server uses `pdfjs-dist` to extract the text and forwards it to the AI model (`openrouter/free`).
* The AI returns structured JSON data representing the candidate's **Role, Experience, Projects, and Skills**.
* Empty fields on the form are autofilled automatically without overwriting existing entries.

### 3. Voice Interview Engine
* Once started, the backend consumes **50 credits** and generates 5 tailored questions progressing in difficulty (Easy ➔ Medium ➔ Hard).
* The browser's native **Web Speech API** (`webkitSpeechRecognition`) is used for speech-to-text. It streams transcriptions in real time and handles voice pauses gracefully.
* When the user submits their answer or the timer runs out, the answer is evaluated by the AI.

### 4. AI Evaluation & Scoring
* Answers are judged by the AI model on:
  1. **Confidence** (0-10)
  2. **Communication** (0-10)
  3. **Correctness** (0-10)
* The model returns a final score (average of the three) and concise feedback.
* Upon finishing all 5 questions, the backend computes the average metrics and generates an interview performance report.

### 5. Credits & Payment System (Razorpay)
* Starting an interview costs **50 credits**. Users start with 100 free credits upon sign-up.
* If credits run out, users can purchase additional credit bundles (Starter or Pro) from the **Pricing** page.
* Razorpay handles payments securely. The backend verifies the digital signature before updating the user's credits.

---

## 🛠️ Folder Structure

```
3.interviewIQ/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Setup, Voice Interview, Report)
│   │   ├── pages/          # Main Pages (Auth, Home, History, Pricing)
│   │   ├── redux/          # State management (User info, credits)
│   │   └── utils/          # Firebase config
│   └── package.json
└── server/                 # Express Backend (NodeJS)
    ├── config/             # DB & JWT config
    ├── controllers/        # Route controllers (Auth, Payments, Interview logic)
    ├── middlewares/        # Authentication & file upload middleware
    ├── models/             # Database Schemas (User, Interview)
    ├── routes/             # Express API Endpoints
    ├── services/           # OpenRouter AI & Razorpay services
    └── package.json
```

---

## 💻 Local Setup & Development

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **Git** installed.

### 2. Backend Config (`server/`)
Create a `server/.env` file with:
```env
PORT=8000
MONGODB_URL=mongodb+srv://...           # Your MongoDB connection string
JWT_SECRET=your_jwt_secret_key          # Random alphanumeric string
OPENROUTER_API_KEY=sk-or-v1-...         # OpenRouter API key (uses free models)
RAZORPAY_KEY_ID=rzp_test_...            # Razorpay Test Key
RAZORPAY_KEY_SECRET=your_secret         # Razorpay Secret Key
FRONTEND_URL=http://localhost:5173      # Local frontend URL
```
To run the server:
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Config (`client/`)
Create a `client/.env` file with:
```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_APIKEY=AIzaSy...           # Your Firebase Web API Key
VITE_RAZORPAY_KEY_ID=rzp_test_...        # Razorpay Test Key ID
```
To run the frontend:
```bash
cd client
npm install
npm run dev
```

---

## 🚀 Deployment Overview

The codebase is fully optimized for cross-origin deployment:
* **Frontend** can be hosted on **Vercel** or **Netlify** (Root folder: `client`).
* **Backend** can be hosted on **Render** or **Railway** (Root folder: `server`).
* Cookies are configured with dynamic `secure` and `sameSite: "none"` flags to support cross-domain session cookies in production.
