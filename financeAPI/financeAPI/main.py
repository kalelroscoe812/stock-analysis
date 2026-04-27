from flask import Flask, jsonify, request, render_template
import yfinance as yf
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stocks.db'
db = SQLAlchemy(app)
login_manager = LoginManager(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(10), unique=True, nullable=False)
    industry = db.Column(db.String(100))

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey('stock.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stock/<ticker>', methods=['GET'])
def get_stock_data(ticker):
    try:
        stock = yf.Ticker(ticker.upper())
        info = stock.info

        if not info or 'currentPrice' not in info:
            return jsonify({"error": "Ticker not found", "ticker": ticker}), 404

        # Get financials for growth rate
        financials = stock.financials
        growth_rate = None
        if 'Net Income' in financials.index and len(financials.loc['Net Income']) >= 2:
            net_income = financials.loc['Net Income']
            current = net_income.iloc[0]
            previous = net_income.iloc[1]
            if previous != 0:
                growth_rate = ((current - previous) / previous) * 100

        pe = info.get('trailingPE')
        peg = None
        if growth_rate and pe and pe != 0:
            peg = growth_rate / pe

        data = {
            "ticker": ticker.upper(),
            "currentPrice": info.get("currentPrice"),
            "growthRate": growth_rate,
            "pe": pe,
            "peg": peg,
            "industry": info.get("industry")
        }

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e), "ticker": ticker}), 500

@app.route('/favorite/<ticker>', methods=['POST'])
@login_required
def favorite_stock(ticker):
    stock = Stock.query.filter_by(ticker=ticker.upper()).first()
    if not stock:
        # Fetch industry
        try:
            yf_stock = yf.Ticker(ticker.upper())
            info = yf_stock.info
            industry = info.get('industry')
        except:
            industry = None
        stock = Stock(ticker=ticker.upper(), industry=industry)
        db.session.add(stock)
        db.session.commit()

    existing = Favorite.query.filter_by(user_id=current_user.id, stock_id=stock.id).first()
    if existing:
        return jsonify({"message": "Already favorited"}), 400

    fav = Favorite(user_id=current_user.id, stock_id=stock.id)
    db.session.add(fav)
    db.session.commit()
    return jsonify({"message": "Favorited"}), 200

@app.route('/favorites', methods=['GET'])
@login_required
def get_favorites():
    industry = request.args.get('industry')
    query = db.session.query(Favorite, Stock).join(Stock).filter(Favorite.user_id == current_user.id)
    if industry:
        query = query.filter(Stock.industry == industry)
    favorites = query.all()

    result = []
    for fav, stk in favorites:
        # Get metrics
        metrics = get_stock_data(stk.ticker).get_json()
        if 'error' not in metrics:
            metrics['industry'] = stk.industry
            result.append(metrics)
    return jsonify(result)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and user.password == password:  # In real app, hash passwords
            login_user(user)
            return jsonify({"message": "Logged in"}), 200
        return jsonify({"error": "Invalid credentials"}), 401
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
