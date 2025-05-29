# Intern Routine Tracker Backend

This is the backend API for the Intern Routine Tracker application, built with .NET 7 and MongoDB.

## 🛠️ Technologies Used

- .NET 7 Web API
- MongoDB for data storage
- JWT for authentication
- Repository pattern for data access
- Dependency Injection
- Background services for notifications

## 📋 Features

- User authentication (register, login)
- Daily note management (create, read, update, delete)
- Activity tracking
- Notification system for missed notes
- Streak tracking

## 🚀 Getting Started

### Prerequisites

- [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation or MongoDB Atlas)

### Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd InternRoutineTracker/backend
   ```
3. Update the MongoDB connection string in `appsettings.json` if needed
4. Build the application:
   ```
   dotnet build
   ```
5. Run the application:
   ```
   dotnet run --project InternRoutineTracker.API
   ```

The API will be available at `https://localhost:7000` and `http://localhost:5000` by default.

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/user` - Get current user information

### Notes

- `GET /api/notes` - Get all notes for the current user
- `GET /api/notes/{id}` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/{id}` - Update a note
- `DELETE /api/notes/{id}` - Delete a note
- `GET /api/notes/date-range` - Get notes within a date range

### Notifications

- `GET /api/notifications` - Get all notifications for the current user
- `GET /api/notifications/count` - Get unread notification count
- `PUT /api/notifications/{id}/read` - Mark a notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

### Activity Logs

- `GET /api/activitylogs` - Get all activity logs for the current user
- `GET /api/activitylogs/date` - Get activity for a specific date
- `GET /api/activitylogs/streak` - Get current streak
- `GET /api/activitylogs/date-range` - Get activity logs within a date range

## 📝 Project Structure

- `Controllers/` - API endpoints
- `Models/` - Data models and DTOs
- `Repositories/` - Data access layer
- `Services/` - Business logic
- `Middleware/` - Custom middleware
- `Helpers/` - Utility classes

## 🔒 Security

- JWT authentication for API security
- Password hashing with salt
- Role-based authorization
- Input validation and error handling

## 🧪 Testing

Run the tests using:

```
dotnet test
```
