"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Eye, EyeOff, User } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
    console.log('Login:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-purple-900">GlobalTrotter</span>
          </div>
          <p className="text-gray-600">Welcome back! Sign in to continue your journey.</p>
        </div>

        {/* Login Form */}
        <Card className="auth-card">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-purple-600" />
            </div>
            <CardTitle className="text-2xl text-purple-900">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-purple-900 font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-purple-900 font-medium">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-purple-600 hover:text-purple-700">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full purple-gradient hover:from-purple-700 hover:to-violet-700 text-white py-3 rounded-lg font-medium"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}