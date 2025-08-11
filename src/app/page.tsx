'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if user needs password reset
        if (data.needsPasswordReset) {
          setError(data.error + ' Redirecting to password reset...');
          setTimeout(() => {
            router.push('/forgot-password');
          }, 2000);
          return;
        }
        throw new Error(data.error || 'Login failed');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      setError('');

      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }

      // Optional: Decode the token to show user info
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);
      console.log('Google user:', decoded);

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Google login failed');
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-blue-800/30 p-8 rounded-lg shadow-lg border border-blue-700/50 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-center text-white mb-6">Sign In</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-blue-900/50 text-white border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-blue-900/50 text-black border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-300"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-400 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-200">
                  Remember me
                </label>
              </div>

              <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
              
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-blue-200">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_blue"
                size="large"
                shape="rectangular"
                text="signin_with"
                logo_alignment="left"
              />
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-blue-200">
            Dont have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}