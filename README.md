# Stock Analysis App

A web application for querying stock metrics including growth rate, P/E ratio, and PEG ratio. Users can favorite stocks, view favorites, and filter by industry.

## Features

- Query stocks by ticker symbol
- Display key metrics: Growth Rate (from net income), P/E Ratio, PEG Ratio
- Error handling for invalid tickers
- Favorite stocks with industry classification
- View and search favorited stocks by industry
- User authentication and personalized favorites

## Installation

1. Clone the repository
2. Navigate to `financeAPI/financeAPI`
3. Install dependencies: `pip install -r requirements.txt`
4. Create a `.env` file with the required settings
5. Run the app: `python main.py`

## Configuration
Create a `.env` file inside `financeAPI/financeAPI` with the following values:

```env
SECRET_KEY=your-secret-key
FLASK_APP=main.py
FLASK_ENV=development
```

Generate a secure secret key with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

The app now auto-logs in a demo user during development so you can use the stock analysis pages without manually visiting the login screen.

## Usage

- Access the app at `http://localhost:5000`
- Login to access favorites
- Query stocks and favorite them

## API Endpoints

- `GET /stock/<ticker>`: Get stock metrics
- `POST /favorite/<ticker>`: Favorite a stock (requires login)
- `GET /favorites`: Get user's favorites (requires login)

## Testing

Run tests with: `python -m unittest tests/test_main.py`

## Technologies

- Flask
- yfinance
- SQLAlchemy
- Flask-Login

## Team

- Justin
- Paul
- Kalel
- Daniel