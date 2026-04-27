import unittest
from main import app, db
import json

class TestStockApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.drop_all()

    def test_get_stock_valid(self):
        response = self.app.get('/stock/AAPL')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('ticker', data)
        self.assertEqual(data['ticker'], 'AAPL')

    def test_get_stock_invalid(self):
        response = self.app.get('/stock/INVALID')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertIn('error', data)

if __name__ == '__main__':
    unittest.main()