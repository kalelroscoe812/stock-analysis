import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrendingUp } from 'lucide-react';

export function AuthPage() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  // ✅ LOGIN (checks all users)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const foundUser = users.find(
      (u: any) =>
        u.email === loginEmail &&
        u.password === loginPassword
    );

    if (!foundUser) {
      alert('Invalid email or password');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    navigate('/dashboard');
  };

  // ✅ SIGNUP (stores multiple users)
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupEmail || !signupPassword || !signupName) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // prevent duplicate users
    if (users.some((u: any) => u.email === signupEmail)) {
      alert('User already exists');
      return;
    }

    const newUser = {
      email: signupEmail,
      password: signupPassword,
      name: signupName,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // ✅ initialize empty stock list for this user
    localStorage.setItem(`stocks_${signupEmail}`, JSON.stringify([]));

    // ✅ log them in immediately
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <TrendingUp className="w-10 h-10 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">StockTracker</h1>
        </div>

        <Tabs defaultValue="login" className="w-full">

          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your credentials</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>

                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIGNUP */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Start tracking your portfolio</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">

                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>

                </form>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}