import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, LogOut, Search } from 'lucide-react';

const API_BASE = "https://refactored-lamp-wr6vgwg57rqjfp54-5000.app.github.dev";

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  shares: number;
}

export function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const storedStocks = localStorage.getItem(`stocks_${parsedUser.email}`);
    if (storedStocks) {
      setStocks(JSON.parse(storedStocks));
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`stocks_${user.email}`, JSON.stringify(stocks));
  }, [stocks, user]);

  const searchStock = async () => {
    if (!searchQuery) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/stock/${searchQuery}`);
      if (!response.ok) throw new Error('Stock not found');

      const data = await response.json();

      const newStock: Stock = {
        id: Date.now().toString(),
        symbol: data.symbol,
        name: data.name,
        price: data.current_price || 0,
        change: data.change || 0,
        changePercent: data.change_percent || 0,
        shares: 0,
      };

      setStocks((prev) => {
        if (prev.some((s) => s.symbol === newStock.symbol)) return prev;
        return [newStock, ...prev];
      });

      setSearchQuery('');
    } catch (err) {
      alert('Stock not found or API error.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    navigate('/');
  };

  const totalValue = stocks.reduce((sum, stock) => sum + (stock.price * stock.shares), 0);
  const totalChange = stocks.reduce((sum, stock) => sum + (stock.change * stock.shares), 0);
  const totalChangePercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;

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
              <span className="text-sm text-gray-600">{user.name || user.email}</span>
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
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Change</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}
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
            <CardTitle>Your Stocks</CardTitle>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search stocks (e.g. AAPL)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') searchStock(); }}
                  className="pl-10"
                />
              </div>
              <Button onClick={searchStock} className="mt-2 w-full" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stocks.map((stock) => (
                <div key={stock.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {stock.symbol}
                      <Badge variant="secondary">{stock.shares} shares</Badge>
                    </div>
                    <div className="text-sm text-gray-600">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">${stock.price.toFixed(2)}</div>
                    <div className={`flex items-center justify-end text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}