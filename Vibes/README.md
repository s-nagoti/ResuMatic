# ResuMatic - AI Resume Optimizer

A powerful web application that uses AI to optimize resumes for specific job descriptions. Upload your resume, analyze job postings, and get tailored suggestions to improve your resume's match rate.

## 🚀 Features

- **Resume Upload**: Support for PDF and DOCX files
- **Job Analysis**: Extract keywords and requirements from job descriptions or URLs
- **AI Optimization**: Get personalized suggestions to improve resume match
- **Version History**: Track all resume versions and changes
- **Keyword Coverage**: Visualize how well your resume matches job requirements
- **Modern UI**: Built with React, TypeScript, and TailwindCSS

## 🛠 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for build tooling
- TailwindCSS for styling
- shadcn/ui for components
- React Router for navigation
- Axios for API calls
- Recharts for data visualization

### Backend
- Node.js + Express
- TypeScript
- Firebase Firestore (database)
- Multer for file uploads
- Puppeteer for web scraping
- Google Gemini AI (with OpenAI fallback)

## 📁 Project Structure

```
Vibes/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   └── lib/             # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── types/           # TypeScript type definitions
│   ├── package.json
│   └── tsconfig.json
└── package.json             # Root package.json for scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (for database)
- Google Gemini API key (or OpenAI API key)

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### 2. Environment Setup

#### Backend Environment
Copy `backend/env.example` to `backend/.env` and configure:

```bash
cd backend
cp env.example .env
```

Edit `backend/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Configuration (get from Firebase Console)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# AI API Configuration
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Environment
Copy `frontend/env.example` to `frontend/.env`:

```bash
cd frontend
cp env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key and download the JSON
6. Use the values from the JSON file in your `.env`

### 4. AI API Setup

#### Option A: Google Gemini (Recommended)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your `.env` file

#### Option B: OpenAI (Fallback)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an API key
3. Add it to your `.env` file

### 5. Run the Application

```bash
# Start both frontend and backend
npm run dev

# Or run them separately:

# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 Usage

### 1. Upload Resume
- Go to the Upload page
- Drag and drop or select a PDF/DOCX file
- Wait for parsing to complete

### 2. Analyze Job Description
- Go to the Analyze page
- Paste a job description or enter a job posting URL
- Get extracted keywords and requirements

### 3. Optimize Resume
- Use the optimization suggestions to improve your resume
- View keyword coverage and missing skills
- Download optimized versions

### 4. View History
- Track all your resume versions
- Compare different optimizations
- Manage your uploaded files

## 🔧 Development

### Available Scripts

```bash
# Root level
npm run dev              # Start both frontend and backend
npm run build            # Build frontend for production
npm run install:all      # Install all dependencies

# Frontend only
npm run dev:frontend     # Start frontend dev server
npm run build:frontend   # Build frontend
npm run preview          # Preview production build

# Backend only
npm run dev:backend      # Start backend with hot reload
npm run build:backend    # Build backend TypeScript
npm run start:backend    # Start production backend
```

### API Endpoints

- `POST /api/uploadResume` - Upload and parse resume
- `POST /api/analyzeJob` - Analyze job description
- `POST /api/optimizeResume` - Optimize resume for job
- `GET /api/history` - Get user's resume history
- `GET /api/history/:versionId` - Get specific resume version
- `DELETE /api/history/:resumeId` - Delete resume

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy with environment variables configured
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:

1. Check the console logs for errors
2. Verify your environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that Firebase and AI APIs are properly configured

## 🔮 Future Features

- [ ] User authentication and accounts
- [ ] Resume templates and formatting
- [ ] ATS score prediction
- [ ] Cover letter generation
- [ ] Job application tracking
- [ ] Advanced analytics and insights
- [ ] Voice feedback and accessibility features
- [ ] Mobile app version

---

Built with ❤️ for job seekers everywhere
