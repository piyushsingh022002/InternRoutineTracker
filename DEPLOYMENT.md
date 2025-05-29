# Deployment Guide for Intern Routine Tracker

This guide provides instructions for deploying the Intern Routine Tracker application to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
   - [Deploying to Render](#deploying-backend-to-render)
   - [Deploying to Azure](#deploying-backend-to-azure)
3. [Frontend Deployment](#frontend-deployment)
   - [Deploying to Netlify](#deploying-frontend-to-netlify)
   - [Deploying to Vercel](#deploying-frontend-to-vercel)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Continuous Integration/Deployment](#continuous-integrationdeployment)
7. [Post-Deployment Checks](#post-deployment-checks)

## Prerequisites

Before deploying, ensure you have:

- A MongoDB Atlas account (or another MongoDB hosting solution)
- A GitHub repository with your code
- Access to a deployment platform (Render, Azure, Netlify, Vercel, etc.)
- Completed testing of your application locally

## Backend Deployment

### Deploying Backend to Render

1. **Create a Render account** at [render.com](https://render.com) if you don't have one.

2. **Create a new Web Service**:
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your backend code

3. **Configure the service**:
   - Name: `intern-routine-tracker-api`
   - Environment: `ASP.NET`
   - Region: Choose the region closest to your users
   - Branch: `main` (or your production branch)
   - Build Command: `dotnet publish -c Release -o out`
   - Start Command: `cd out && dotnet InternRoutineTracker.API.dll`
   - Instance Type: Choose based on your needs (e.g., Free for development, Basic for production)

4. **Add environment variables**:
   - Click on "Environment" and add the following variables:
     - `ASPNETCORE_ENVIRONMENT`: `Production`
     - `MongoDbSettings__ConnectionString`: Your MongoDB Atlas connection string
     - `JwtSettings__SecretKey`: Your JWT secret key (generate a strong random string)
     - `JwtSettings__Issuer`: Your API domain (e.g., `https://intern-routine-tracker-api.onrender.com`)
     - `JwtSettings__Audience`: Your frontend domain (e.g., `https://intern-routine-tracker.netlify.app`)
     - `JwtSettings__ExpiryInMinutes`: `60` (or your preferred token expiry time)

5. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy your application

### Deploying Backend to Azure

1. **Create an Azure account** if you don't have one.

2. **Create an App Service**:
   - Go to the Azure Portal
   - Create a new App Service with .NET 7 runtime
   - Choose your subscription, resource group, and region

3. **Configure deployment**:
   - Set up GitHub Actions for continuous deployment
   - Or use Azure DevOps for CI/CD

4. **Configure application settings**:
   - Add the same environment variables as listed in the Render deployment

5. **Deploy**:
   - Commit and push to your GitHub repository
   - Azure will build and deploy your application

## Frontend Deployment

### Deploying Frontend to Netlify

1. **Create a Netlify account** at [netlify.com](https://netlify.com) if you don't have one.

2. **Create a new site**:
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the repository containing your frontend code

3. **Configure the build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add environment variables**:
   - Go to Site settings > Build & deploy > Environment
   - Add the following variable:
     - `VITE_API_URL`: Your backend API URL (e.g., `https://intern-routine-tracker-api.onrender.com/api`)

5. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy your application

### Deploying Frontend to Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com) if you don't have one.

2. **Import your project**:
   - Click "Import Project"
   - Select "Import Git Repository"
   - Connect your GitHub repository

3. **Configure the project**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add environment variables**:
   - Go to Settings > Environment Variables
   - Add the following variable:
     - `VITE_API_URL`: Your backend API URL

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

## Environment Configuration

### Production Environment Variables

Ensure these environment variables are set in your production environment:

**Backend**:
- `ASPNETCORE_ENVIRONMENT`: `Production`
- `MongoDbSettings__ConnectionString`: Your MongoDB Atlas connection string
- `JwtSettings__SecretKey`: Your JWT secret key
- `JwtSettings__Issuer`: Your API domain
- `JwtSettings__Audience`: Your frontend domain
- `JwtSettings__ExpiryInMinutes`: Token expiry time in minutes

**Frontend**:
- `VITE_API_URL`: Your backend API URL

## Database Setup

### MongoDB Atlas Setup

1. **Create a MongoDB Atlas account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) if you don't have one.

2. **Create a new cluster**:
   - Choose your cloud provider and region
   - Select your cluster tier (M0 is free)

3. **Set up database access**:
   - Create a database user with password authentication
   - Note: Use a strong password and store it securely

4. **Configure network access**:
   - Add IP access list entries
   - For production, you might want to allow access from anywhere (0.0.0.0/0)

5. **Get your connection string**:
   - Go to "Connect" > "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Use this connection string in your backend environment variables

## Continuous Integration/Deployment

### Setting Up GitHub Actions

1. **Create a workflow file** at `.github/workflows/main.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 7.0.x
    - name: Restore dependencies
      run: dotnet restore ./backend/InternRoutineTracker.API
    - name: Build
      run: dotnet build ./backend/InternRoutineTracker.API --no-restore
    - name: Test
      run: dotnet test ./backend/InternRoutineTracker.API --no-build

  build-and-test-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 16
    - name: Install dependencies
      run: cd frontend && npm ci
    - name: Build
      run: cd frontend && npm run build
    - name: Test
      run: cd frontend && npm test
```

## Post-Deployment Checks

After deploying, perform these checks:

1. **API Health Check**:
   - Access your API health endpoint (e.g., `https://your-api.com/api/health`)
   - Ensure it returns a 200 OK response

2. **Frontend Connectivity**:
   - Open your frontend application
   - Verify it can connect to the backend API
   - Test user registration and login

3. **Feature Testing**:
   - Test all critical features (note creation, editing, etc.)
   - Verify notifications are working
   - Check media uploads

4. **Performance Monitoring**:
   - Set up monitoring tools (e.g., Azure Application Insights, New Relic)
   - Monitor API response times and error rates

5. **Security Checks**:
   - Ensure all communications are over HTTPS
   - Verify JWT authentication is working correctly
   - Check that sensitive data is not exposed in API responses

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure your backend CORS configuration includes your frontend domain
   - Check for any proxy issues

2. **Database Connection Issues**:
   - Verify your MongoDB connection string is correct
   - Check if your IP is allowed in MongoDB Atlas

3. **JWT Authentication Problems**:
   - Ensure your JWT secret key is properly set
   - Check that issuer and audience settings match your domains

4. **Build Failures**:
   - Review build logs for specific errors
   - Ensure all dependencies are correctly installed

For any other issues, check the application logs in your deployment platform's dashboard.
