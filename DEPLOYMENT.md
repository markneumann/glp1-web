# Railway Deployment Guide

This guide explains how to deploy the GLP-1 Web App to Railway with both frontend and backend services.

## Overview

The application consists of two services:
- **Backend**: Node.js/Express API server
- **Frontend**: React static site served with `serve`

## Prerequisites

1. [Railway account](https://railway.app)
2. GitHub repository with your code
3. MongoDB Atlas database (free tier available)

## Environment Variables

### Backend Environment Variables

Set these in Railway for your backend service:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/glp1

# Authentication
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-service.railway.app

# Node Environment
NODE_ENV=production
```

### Frontend Environment Variables

Set these in Railway for your frontend service:

```bash
# Backend API URL
REACT_APP_API_URL=https://your-backend-service.railway.app/api

# Node Environment
NODE_ENV=production
```

## Railway Deployment Steps

### 1. Deploy Backend Service

1. Go to [Railway](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Select "Deploy from GitHub repo" and choose your `glp1-web` repository
4. Railway will create a service automatically
5. Go to your service settings and set the **Root Directory** to `backend/`
6. Add all the backend environment variables listed above
7. Deploy and note the backend URL (e.g., `https://backend-production-abc.up.railway.app`)

### 2. Deploy Frontend Service

1. In the same Railway project, click "Add Service"
2. Select "GitHub Repo" and choose the same repository
3. Set the **Root Directory** to `frontend/`
4. Add the frontend environment variables:
   - `REACT_APP_API_URL=https://your-backend-service.railway.app/api`
   - `NODE_ENV=production`
5. Deploy and note the frontend URL

### 3. Update Backend CORS

1. Go back to your backend service
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL
3. Redeploy the backend service

## Manual Deployment (Alternative)

If you prefer to deploy each service separately:

### Backend Deployment

```bash
# Build the backend
cd backend
npm run build

# Deploy to Railway
railway login
railway link
railway up
```

### Frontend Deployment

```bash
# Build the frontend
cd frontend
npm run build

# Deploy to Railway
railway login
railway link
railway up
```

## Configuration Files Created

- `railway.toml` - Main Railway configuration
- `backend/railway.json` - Backend service configuration
- `frontend/railway.json` - Frontend service configuration
- `frontend/.env.production` - Production environment variables
- `frontend/.env.example` - Environment variables template

## Health Checks

- Backend: `GET /api/health`
- Frontend: `GET /` (served by static site)

## Troubleshooting

### Common Issues

1. **CORS errors**: Make sure `FRONTEND_URL` in backend matches your actual frontend URL
2. **API not found**: Verify `REACT_APP_API_URL` points to correct backend service
3. **Database connection**: Check MongoDB URI format and network access
4. **Build failures**: Ensure all dependencies are in `package.json`

### Logs

Check Railway service logs for debugging:
- Go to your service in Railway dashboard
- Click on "Logs" tab to see real-time logs

## Cost Considerations

Railway free tier includes:
- 500 hours/month of usage (across all services)
- Services sleep after inactivity
- Automatic SSL certificates

For production use, consider upgrading to a paid plan for always-on services.