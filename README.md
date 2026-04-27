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
4. Run the app: `python main.py`

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