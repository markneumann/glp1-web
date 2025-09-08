# GLP1 Web App

A comprehensive GLP-1 medication tracking web application built with React/TypeScript frontend and Node.js/Express backend.

## Features

- **Medication Tracking**: Log GLP-1 shots with dosage, site, and timing
- **Health Metrics**: Track weight, calories, protein, water intake, and side effects
- **Analytics Dashboard**: Visual charts and trends for progress monitoring
- **Data Export**: Export your data in CSV or JSON formats
- **Privacy-First**: Secure authentication and encrypted data storage

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB URI and JWT secret

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Development

- Backend runs on `http://localhost:4000`
- Frontend runs on `http://localhost:3000`
- MongoDB required (local or cloud instance)

## Deployment

This application is configured for deployment on Railway. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Quick Deploy to Railway

1. Fork/clone this repository
2. Create a [Railway](https://railway.app) account
3. Connect your GitHub repository
4. Follow the step-by-step guide in [DEPLOYMENT.md](DEPLOYMENT.md)

The app will be deployed as two separate services:
- **Backend API**: Node.js/Express server
- **Frontend**: Static React app served with `serve`

## Project Structure

```
glp1-web/
├── backend/
│   ├── src/
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Authentication middleware
│   │   └── index.ts         # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET/POST/PUT/DELETE /api/medications` - Medication management
- `GET/POST/PUT/DELETE /api/health-metrics` - Health metrics management
- `GET/POST/PUT/DELETE /api/side-effects` - Side effects management
- `GET /api/export/csv` - Export data as CSV
- `GET /api/export/json` - Export data as JSON