import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, LogOut, Plus, Search } from 'lucide-react';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  shares: number;
}

const MOCK_STOCKS: Stock[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.35, changePercent: 1.33, shares: 10 },
  { id: '2', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: -1.20, changePercent: -0.83, shares: 5 },
  { id: '3', symbol: 'MSFT', name: 'Microsoft Corp.', price: 420.15, change: 5.60, changePercent: 1.35, shares: 8 },
  { id: '4', symbol: 'TSLA', name: 'Tesla Inc.', price: 245.30, change: -3.45, changePercent: -1.39, shares: 15 },
];

export function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [stocks, setStocks] = useState<Stock[]>(MOCK_STOCKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));

    // Fetch real stock data
    fetchRealStockData();
  }, [navigate]);

  const fetchRealStockData = async () => {
    setLoading(true);
    try {
      const updatedStocks = await Promise.all(
        MOCK_STOCKS.map(async (stock) => {
          try {
            const response = await fetch(`http://localhost:5000/stock/${stock.symbol}`);
            if (response.ok) {
              const data = await response.json();
              return {
                ...stock,
                price: data.current_price || stock.price,
                change: data.change || stock.change,
                changePercent: data.change_percent || stock.changePercent,
                name: data.name || stock.name,
              };
            }
          } catch (error) {
            console.error(`Failed to fetch ${stock.symbol}:`, error);
          }
          return stock;
        })
      );
      setStocks(updatedStocks);
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const totalValue = stocks.reduce((sum, stock) => sum + (stock.price * stock.shares), 0);
  const totalChange = stocks.reduce((sum, stock) => sum + (stock.change * stock.shares), 0);
  const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100;

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">StockTracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Portfolio Value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Change</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalChange >= 0 ? '+' : ''}${totalChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Change Percent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${totalChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Stocks</CardTitle>
                <CardDescription>Track your portfolio performance</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock
              </Button>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading stock data...</div>
            ) : (
              <div className="space-y-4">
                {filteredStocks.map((stock) => (
                <div
                  key={stock.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold text-lg">{stock.symbol}</div>
                        <div className="text-sm text-gray-600">{stock.name}</div>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {stock.shares} shares
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className={`flex items-center justify-end text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="text-right ml-8">
                    <div className="text-sm text-gray-600">Value</div>
                    <div className="font-semibold">
                      ${(stock.price * stock.shares).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}