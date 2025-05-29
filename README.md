# 📝 Intern Routine Tracker

A full-stack productivity app designed for interns and professionals to manage their daily notes, stay consistent, and receive smart reminders to improve habits. Built with React + TypeScript for the frontend and .NET 7 Web API with MongoDB for the backend.

## 🚀 Features

- ✅ **User Authentication**: Secure registration and login with JWT
- 📊 **Interactive Dashboard**: View your activity at a glance with streak tracking
- 📝 **Daily Notes**: Create, edit, view, and delete your daily entries
- 🏷️ **Tags System**: Organize notes with custom tags (e.g., "Meeting", "Learning")
- 📎 **Media Uploads**: Attach images and PDFs to your notes
- 🔔 **Smart Notifications**: Get reminders when you miss creating a daily note
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Smooth Animations**: Polished UI with Framer Motion transitions

## 🧰 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Framer Motion** for animations
- **Styled Components** for component-level styling
- **Axios** for API requests
- **JWT** authentication with persistent login

### Backend
- **.NET 7 Web API**
- **MongoDB** for database
- **Repository Pattern** for data access
- **JWT Authentication**
- **Background Services** for notifications
- **Dependency Injection**

## 📁 Project Structure

```
InternRoutineTracker/
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── styles/          # Global styles
│   │   └── types/           # TypeScript type definitions
│   └── README.md            # Frontend documentation
│
├── backend/                 # .NET 7 Web API backend
│   ├── InternRoutineTracker.API/
│   │   ├── Controllers/     # API endpoints
│   │   ├── Models/          # Data models and DTOs
│   │   ├── Repositories/    # Data access layer
│   │   ├── Services/        # Business logic
│   │   └── Middleware/      # Custom middleware
│   └── README.md            # Backend documentation
│
└── README.md                # Main project documentation
```

## 🔧 Getting Started

### Prerequisites

- Node.js (v16+)
- .NET 7 SDK
- MongoDB (local or Atlas)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd InternRoutineTracker/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your backend API URL:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the frontend at: http://localhost:5173

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd InternRoutineTracker/backend
   ```

2. Update the MongoDB connection string in `appsettings.json` if needed

3. Build and run the application:
   ```bash
   dotnet run --project InternRoutineTracker.API
   ```

4. Access the API at: http://localhost:5000

## 🔒 Security Notes

- Store secrets like DB connection strings in environment variables in production
- Use HTTPS for frontend/backend hosting
- JWT tokens are stored in localStorage - consider implementing refresh tokens for production

## 📱 Screenshots

- Dashboard with activity tracking
- Note editor with media uploads
- Mobile-responsive design

## 📚 Additional Documentation

- See [frontend/README.md](./frontend/README.md) for detailed frontend documentation
- See [backend/README.md](./backend/README.md) for detailed backend documentation
