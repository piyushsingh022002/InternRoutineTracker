# InternRoutineTracker
Manage and keep the Records of user on daily basis and can be deleted and updated.


# 📝 Intern Daily Tracker

A full-stack productivity app designed for interns and professionals to manage their daily notes, stay consistent, and receive smart reminders to improve habits. Built with React + TypeScript for the frontend and .NET 7 Web API with MongoDB Atlas for the backend.

---

## 🚀 Features

- ✅ User Registration & Login (JWT Auth)
- 🧠 Dashboard with daily note cards (date & day)
- ✍️ Create, Edit, Delete, View notes
- 📎 Upload images or PDFs with notes
- 🗓️ Track daily activity — reminds users if they miss a day
- ⚡ Smooth transitions using Framer Motion
- 🧩 Component-level styling for maintainable design
- 🌐 Deployed backend with MongoDB Atlas + Render

---

## 📁 Project Structure

/intern-daily-tracker
│
├── frontend/ # React + TS with component-level styling
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── styles/
│ └── ...
│
├── backend/ # .NET 7 Web API with MongoDB
│ ├── Controllers/
│ ├── Models/
│ ├── Services/
│ ├── appsettings.json
│ └── ...
│
└── README.md



---

## 🧰 Tech Stack

| Layer     | Tech                     |
|-----------|--------------------------|
| Frontend  | React + TypeScript       |
| Styling   | Component-based (CSS Modules or Styled Components) |
| Animations| Framer Motion            |
| Backend   | .NET 7 (C# Web API)      |
| Database  | MongoDB Atlas            |
| Hosting   | Render                   |

---

## 🔧 Getting Started

### 📦 Prerequisites

- Node.js (v16+)
- .NET 7 SDK
- MongoDB Atlas (connection string)

### 🔌 Clone the Repo

```bash
git clone https://github.com/your-username/intern-daily-tracker.git
cd intern-daily-tracker


Setup Frontend
cd frontend
npm install
npm run dev


Setup Backend
cd backend
dotnet restore
dotnet run

Security Notes

Store secrets like DB connection strings in environment variables in production.
Use HTTPS for frontend/backend hosting.
Refresh tokens & CSRF protection are recommended in production.




