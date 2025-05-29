# Intern Routine Tracker Frontend

This is the frontend for the Intern Routine Tracker application, built with React, TypeScript, and Vite.

## 🛠️ Technologies Used

- React 18
- TypeScript
- Vite for fast development
- React Router for navigation
- Framer Motion for animations
- Styled Components for styling
- Axios for API requests
- JWT for authentication

## 📋 Features

- User authentication (register, login)
- Dashboard with activity overview
- Daily note creation and management
- Media upload support (images, PDFs)
- Notifications for missed notes
- Streak tracking
- Responsive design for mobile and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Setup

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd InternRoutineTracker/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the frontend directory with the following content:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
5. Start the development server:
   ```
   npm run dev
   ```

The application will be available at `http://localhost:5173` by default.

## 📁 Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/context/` - React context providers
- `src/services/` - API services
- `src/styles/` - Global styles
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

## 🔧 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## 🎨 Styling

The application uses styled-components for component-level styling. Global styles are defined in `src/styles/global.css`.

## 🔒 Authentication

Authentication is handled using JWT tokens stored in localStorage. The AuthContext provider manages the authentication state and provides login/logout functionality.

## 📱 Responsive Design

The application is designed to work on both desktop and mobile devices. Media queries are used to adjust the layout based on screen size.
