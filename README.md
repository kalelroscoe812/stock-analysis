# 📈 StockTracker – Full-Stack Portfolio Manager

A professional-grade portfolio management tool. This application synchronizes a **React (Vite) frontend** with a **Python (Flask) REST API** to provide real-market data tracking, secure user authentication, and persistent asset valuation.

---

### 🚀 Key Features

* **🔐 JWT-Powered Security:** Secure registration and login flow using `Flask-JWT-Extended` to protect user data.
* **📊 Live Market Data:** Real-time stock metrics (Price, Day Change, %) fetched dynamically via the Yahoo Finance API (`yfinance`).
* **🐋 Dockerized Architecture:** Fully containerized services using Docker Compose for seamless deployment and environment parity across Mac, Windows, and Linux.
* **🔢 Dynamic Portfolio Valuation:** Real-time calculation of total portfolio value and growth metrics based on user-inputted share counts.

---

### 👥 Team Contributions & Milestone Victories

We transformed technical roadblocks into system-wide improvements. Here is how our team collaborated to build the final production-ready architecture:

* **👨‍💻 Justin (Lead: Backend & Auth)**
  * **The Win:** Implemented the JWT architecture and forced database initialization within the Flask app context.
  * **Hiccup Resolved:** Debugged the **"500 Internal Server Error"** by ensuring the SQLite schema (`stocks.db`) was generated before the first request ever hit the server.

* **📊 Paul (Lead: Data & API)**
  * **The Win:** Standardized the API JSON responses for consumption by the React frontend.
  * **Hiccup Resolved:** Fixed the **"Empty Metric"** bug by ensuring the backend always provided fallback `0.0` values for `regularMarketChange` and `changePercent`.

* **🎨 Kalel (Lead: Frontend & UI)**
  * **The Win:** Built the responsive React Dashboard and the dynamic "Update Shares" state logic.
  * **Hiccup Resolved:** Defeated the **"Phantom CORS"** boss. Diagnosed that Microsoft Dev Tunnels were intercepting preflight `OPTIONS` requests, and successfully re-routed the frontend directly to `http://localhost:5000` to establish a clean, proxy-free handshake.

* **🗄️ Daniel (Lead: DevOps & Testing)**
  * **The Win:** Orchestrated the transition to Docker Compose and managed local volume persistence.
  * **Hiccup Resolved:** Solved the **"Pip ReadTimeoutError"** during the container build by optimizing the `requirements.txt` to leverage Docker's layer caching, reducing build times and eliminating network bottleneck failures.

---

### 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, TailwindCSS, Lucide Icons |
| **Backend** | Python, Flask, SQLAlchemy, Flask-JWT-Extended |
| **Data API** | Yahoo Finance (`yfinance`), Pandas, NumPy |
| **DevOps** | Docker, Docker Compose, WSL2 |

---

### ⚙️ Initialization 

The most reliable way to run this application is via Docker. This eliminates all `venv`, Python versioning, and Node.js conflicts.

**Prerequisites:**
* Docker Desktop installed and running.
* Git cloned to your local machine.

**Steps:**
1. Navigate to the root directory of the project:
   ```bash
   cd stock-analysis

docker-compose up --build

Access the App: Open your browser and navigate to http://localhost:5173.

Backend API: The Flask server runs silently in the background at http://localhost:5000.