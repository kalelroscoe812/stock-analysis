📈 StockTracker – Full-Stack Portfolio Manager
A professional full-stack web application for real-time stock analysis and persistent portfolio tracking. This project features a React (Vite) frontend and a Python (Flask) REST API, utilizing secure JWT authentication and real-market data synchronization.

🚀 Key Features
🔐 Secure JWT Authentication: Real backend user registration and login using flask-jwt-extended.

📊 Live Market Sync: Real-time stock data (Price, Day Change, %) fetched via the Yahoo Finance API.

💾 Persistent Multi-User Portfolios: Each user maintains a private, persistent list of stock holdings.

🔢 Dynamic Asset Tracking: Real-time calculation of total portfolio value and growth percentages based on user-inputted share counts.

👥 Team Contributions & Hiccup Resolution
We turned every technical "hiccup" into a learning milestone. Here is how our team roles tackled the project's most relevant challenges:

👨‍💻 Justin (Lead: Backend & Auth): * Task: Integrated flask-jwt-extended to replace local-only sessions.

Hiccup Resolved: Debugged the "500 Internal Server Error" by forcing database table creation (db.create_all) inside the Flask app context, ensuring the SQLite stocks.db was always ready for new users.

📊 Paul (Lead: Data & Enhancements): * Task: Optimized API response structures to ensure frontend calculations matched backend data.

Hiccup Resolved: Fixed the "Missing Data" bug where change and change_percent were missing from the JSON response, enabling the "Total Portfolio Change" cards to function correctly.

🎨 Kalel (Lead: Frontend & UI): * Task: Built the React Dashboard and search logic.

Hiccup Resolved: Solved the "Phantom CORS Error" and the "302 Redirect" issue by diagnosing GitHub Codespaces port security and implementing the API_BASE toggle system for forwarded ports.

🗄️ Daniel (Lead: Database & Testing): * Task: Managed data integrity and environment stability.

Hiccup Resolved: Identified that "Stale LocalStorage" was causing login failures and established the "Nuclear Reset" protocol to ensure a clean handshake between the frontend and the new backend database.

⚙️ Initialization (Most Reliable Steps)
Follow these steps in order to ensure the environment handshake is successful.

1. Backend Setup (Terminal 1)
Bash
# Navigate and clean old data
cd financeAPI/financeAPI
rm -f stocks.db && rm -rf instance/

# Rebuild environment
python -m venv venv --copies
source venv/bin/activate
pip install flask flask-sqlalchemy flask-cors flask-jwt-extended yfinance python-dotenv

# Start server
python main.py
2. Frontend Setup (Terminal 2)
Bash
# Navigate and install
cd /workspaces/stock-analysis
npm install
npm run dev
3. The "Magic Handshake" (Codespaces Only)
To prevent CORS/302 Redirect errors:

Go to the PORTS tab in Codespaces.

Set Port 5000 and 5173 visibility to Public.

Crucial: Right-click the URL for Port 5000 -> Open in Browser.

If asked, click "Sign in to continue." Once you see the blank page or JSON, return to the app on Port 5173.

Open the browser console (F12), type localStorage.clear(), and refresh.

🧠 Lessons Learned
CORS is often a symptom, not the cause: Many "CORS errors" were actually backend 500 crashes or GitHub login redirects disguised as header issues.

Environment Sync: Cloud development (Codespaces) requires specific port visibility management that local dev does not.

Silent Failures: Using if (!user) return null taught us to always implement visible error handling to avoid "invisible" UI bugs.

🛠️ Tech Stack
Frontend: React, Vite, TypeScript, TailwindCSS, Lucide Icons

Backend: Python, Flask, SQLAlchemy, Flask-JWT-Extended

Data: Yahoo Finance API (yfinance)

StockTracker – Built with passion and a lot of debugging.