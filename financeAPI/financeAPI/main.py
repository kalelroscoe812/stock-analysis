from flask import Flask, jsonify, request, render_template
import yfinance as yf
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///stocks.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

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

def get_or_create_demo_user():
    user = User.query.filter_by(username='demo').first()
    if not user:
        user = User(username='demo', password='demo')
        db.session.add(user)
        db.session.commit()
    return user

@app.before_request
def auto_login_demo_user():
    if not current_user.is_authenticated and request.endpoint not in ('login', 'static'):
        login_user(get_or_create_demo_user())

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stock/<ticker>', methods=['GET'])
def get_stock_data(ticker):
    try:
        ticker = str(ticker).strip().upper()
        if not ticker:
            return jsonify({"error": "Ticker is required", "ticker": ticker}), 400
            
        stock = yf.Ticker(ticker)
        info = stock.info or {}
        current_price = None
        
        # Try multiple methods to get price
        current_price = info.get('currentPrice')
        if current_price is None:
            current_price = info.get('regularMarketPrice')
        
        if current_price is None:
            try:
                history = stock.history(period='1y', interval='1d')
                if history is not None and not history.empty:
                    current_price = float(history['Close'].iloc[-1])
            except:
                pass
        
        if current_price is None:
            try:
                # Get latest quote
                data_dict = yf.download(ticker, period='1d', progress=False)
                if data_dict is not None and not data_dict.empty and 'Close' in data_dict.columns:
                    current_price = float(data_dict['Close'].iloc[-1])
            except:
                pass

        if current_price is None:
            return jsonify({"error": f"Could not fetch data for ticker {ticker}. Please check the symbol.", "ticker": ticker}), 404

        financials = stock.financials
        growth_rate = None
        if financials is not None and not financials.empty and 'Net Income' in financials.index:
            try:
                net_income = financials.loc['Net Income']
                if len(net_income) >= 2:
                    current = float(net_income.iloc[0])
                    previous = float(net_income.iloc[1])
                    if previous != 0:
                        growth_rate = ((current - previous) / previous) * 100
            except:
                pass

        pe = info.get('trailingPE') or info.get('forwardPE')
        peg = None
        if growth_rate is not None and pe is not None and pe > 0:
            peg = growth_rate / pe

        data = {
            "ticker": ticker,
            "currentPrice": round(current_price, 2),
            "growthRate": round(growth_rate, 2) if growth_rate else None,
            "pe": round(pe, 2) if pe else None,
            "peg": round(peg, 4) if peg else None,
            "industry": info.get("industry")
        }

        return jsonify(data)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Server error: {str(e)}", "ticker": ticker}), 500

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
