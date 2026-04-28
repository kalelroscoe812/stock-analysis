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

⚙️ Installation & Initialization

🖥️ Option 1: Local Setup (Mac / Linux / Windows)
1. Clone Repository
git clone <repo-url>
cd stock-analysis
2. Backend Setup
cd financeAPI/financeAPI
Create virtual environment

Mac/Linux:

python -m venv venv
source venv/bin/activate

Windows:

python -m venv venv
venv\\Scripts\\activate
Install dependencies
pip install -r requirements.txt
pip install flask-cors
Create .env file
SECRET_KEY=devkey
FLASK_APP=main.py
FLASK_ENV=development
Run backend
python main.py

Backend runs at:

http://localhost:5000
3. Frontend Setup (new terminal)
cd stock-analysis
npm install
npm run dev

Frontend runs at:

http://localhost:5173
☁️ Option 2: GitHub Codespaces (Linux Environment)
1. Open project in Codespaces
cd /workspaces/stock-analysis
2. Backend Setup
cd financeAPI/financeAPI

⚠️ Fix venv issue (IMPORTANT)

Codespaces may fail with symlink errors, so use:

rm -rf venv
python -m venv venv --copies
Activate environment (Linux only)
source venv/bin/activate
Install dependencies
pip install -r requirements.txt
pip install flask-cors
Run backend
python main.py
3. Frontend Setup (new terminal)
cd /workspaces/stock-analysis
npm install
npm run dev

🔥 Accessing the App in Codespaces

DO NOT use localhost.

Instead:

Open Ports tab
Find port 5173
Click “Open in Browser”
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

❌ Blank Screen (Frontend)

Wrong import:

import { useNavigate } from 'react-router' // ❌

Fix:

import { useNavigate } from 'react-router-dom'

Other causes:

Syntax error in main.tsx
Component returning null

❌ Tailwind / CSS Not Working
Fix PostCSS config → use:
postcss.config.cjs

❌ CORS Errors
Backend must allow frontend requests
Fixed using Flask-CORS

❌ Backend Not Responding
Ensure:
http://localhost:5000/stock/AAPL

returns JSON

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