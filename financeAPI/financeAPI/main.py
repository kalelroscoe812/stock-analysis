from flask import Flask, jsonify, request
import yfinance as yf
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# =======================
# CONFIGURATION
# =======================
# Allow CORS so Vite can connect securely
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///stocks.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secure-jwt-key")

db = SQLAlchemy(app)
jwt = JWTManager(app)

# =======================
# DATABASE MODELS
# =======================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    password = db.Column(db.String(150), nullable=False) 

class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(10), unique=True, nullable=False)

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey('stock.id'), nullable=False)

# ✅ FORCE DATABASE CREATION NO MATTER HOW THE APP BOOTS
with app.app_context():
    db.create_all()

# =======================
# AUTHENTICATION ROUTES
# =======================
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"error": "User already exists"}), 400
    
    new_user = User(
        email=data.get('email'),
        name=data.get('name'),
        password=data.get('password')
    )
    db.session.add(new_user)
    db.session.commit()
    
    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({"token": access_token, "user": {"email": new_user.email, "name": new_user.name}}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email'), password=data.get('password')).first()
    
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user": {"email": user.email, "name": user.name}}), 200

# =======================
# STOCK API (PUBLIC)
# =======================
@app.route('/stock/<ticker>', methods=['GET'])
def get_stock_data(ticker):
    try:
        ticker = str(ticker).strip().upper()
        stock = yf.Ticker(ticker)
        info = stock.info or {}

        price = info.get('currentPrice') or info.get('regularMarketPrice')
        change = info.get('regularMarketChange') or 0.0
        change_percent = info.get('regularMarketChangePercent') or 0.0

        if price is None:
            history = stock.history(period='1d')
            if not history.empty:
                price = float(history['Close'].iloc[-1])

        if price is None:
            return jsonify({"error": f"Invalid ticker {ticker}"}), 404

        return jsonify({
            "symbol": ticker,
            "name": info.get("longName", ticker),
            "current_price": round(price, 2),
            "change": round(change, 2),
            "change_percent": round(change_percent, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)