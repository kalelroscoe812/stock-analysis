📈 StockTracker – Full Stack Stock Analysis App

A full-stack web application for analyzing stock performance, tracking portfolios, and managing user authentication. The app combines a React + Vite frontend with a Flask backend API to deliver real-time and mock financial data.

🚀 Features

🔐 Authentication
User login & signup (frontend-based for development)
Local storage session handling
Protected dashboard route

📊 Stock Dashboard
View portfolio with mock + live-updated stock data
Metrics displayed:
Price
Change & % Change
Portfolio value
Search and filter stocks

🌐 Backend API (Flask)
Fetch stock data via:
GET /stock/<ticker>
Supports:
Growth rate
P/E ratio
PEG ratio
Favorites system (backend-supported)

🛠️ Tech Stack
Frontend
React (Vite)
TypeScript
TailwindCSS
React Router
Lucide Icons
Backend
Flask
yfinance
SQLAlchemy
Flask-Login
Flask-CORS

⚙️ Installation
1. Clone the Repository
git clone <https://github.com/kalelroscoe812/stock-analysis.git>
cd stock-analysis

🖥️ Frontend Setup
npm install
npm run dev

App runs at:

http://localhost:5173

🧠 Backend Setup
cd financeAPI/financeAPI
pip install -r requirements.txt
Create .env file:
SECRET_KEY=your-secret-key
FLASK_APP=main.py
FLASK_ENV=development

Run backend:

python main.py

Backend runs at:

http://localhost:5000
🔗 Important Configuration
✅ Enable CORS (Required)

In main.py:

from flask_cors import CORS
CORS(app)

📡 API Endpoints
Method	Endpoint	Description
GET	/stock/<ticker>	Fetch stock metrics
POST	/favorite/<ticker>	Add favorite
GET	/favorites	Get favorites

🧪 Testing
python -m unittest tests/test_main.py

⚠️ Known Issues & Fixes

❌ Vite CSS / PostCSS Errors
Cause: ESM vs CommonJS config mismatch
Fix: Use postcss.config.cjs

❌ Blank Screen (Frontend)

Causes encountered:

Wrong import:

import { useNavigate } from 'react-router' // ❌

✅ Fixed:

import { useNavigate } from 'react-router-dom'

Other issues:

Syntax error ()q in main.tsx)
Component returning null when user not found

❌ CORS Errors
Frontend (5173) vs Backend (5000)
Fixed using Flask-CORS

❌ Tailwind Not Rendering
Caused by config syntax errors
Fixed by correcting tailwind.config.js

👥 Team & Task Summary
👨‍💻 Justin – Backend & Authentication (AUTH-001)

Responsibilities:

Implement secure authentication
Handle backend logic and API reliability

Completed:

Basic authentication flow (frontend + localStorage)
Flask API endpoints for stock data
Error handling in API routes

Challenges:

Authentication not fully integrated (Flask-Login vs frontend auth mismatch)
Session management not yet unified across frontend/backend

📊 Paul – Data & Enhancements (DATA-002)

Responsibilities:

Integrate financial APIs
Add advanced metrics

Completed:

Stock data fetching via backend
Metric calculations (growth, P/E, PEG)
Mock + live hybrid data system

Challenges:

API reliability & rate limiting
Need for caching layer (Redis not yet implemented)

🎨 Kalel – Frontend & UI (UI-003)

Responsibilities:

Build UI/UX
Integrate frontend with backend

Completed:

Full React app with routing
Login + dashboard UI
Tailwind styling system
Stock dashboard with search + portfolio metrics

Challenges:

Major debugging of Vite + Tailwind config issues
React Router misconfiguration (react-router vs react-router-dom)
Blank screen debugging due to runtime + config errors
CSS pipeline failures from PostCSS misconfiguration

🗄️ Daniel – Database & Testing (DB-004)

Responsibilities:

Database optimization
Testing and CI/CD

Completed:

SQLAlchemy setup
Favorites structure
Initial unit tests

Challenges:

Database not fully integrated with frontend yet
Limited test coverage for edge cases
CI/CD pipeline not fully configured

🧠 Key Lessons Learned
1. ⚠️ Configuration matters more than code

Small config issues (PostCSS, Tailwind, Vite) caused major failures

2. 🔄 ESM vs CommonJS conflicts are real

Mixing module systems broke the build pipeline multiple times

3. 🧪 Debugging requires isolation

Replacing components with <h1> tests was critical

4. 🔗 Frontend & backend must align

CORS and API availability were blockers

5. ⚠️ Silent failures are dangerous

Returning null in React led to invisible bugs

🚀 Future Improvements
Full backend authentication integration (Flask-Login ↔ React)
Real-time stock data with caching (Redis)
Charts & analytics (Chart.js / Recharts)
Deployment (Docker + CI/CD)
Database migrations (Flask-Migrate)

👥 Team
Justin
Paul
Kalel
Daniel