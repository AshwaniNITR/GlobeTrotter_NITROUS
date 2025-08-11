"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Upload, User } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    city: '',
    country: '',
    additionalInfo: '',
    profilePhoto: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, profilePhoto: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic
    console.log('Register:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-purple-900">GlobalTrotter</span>
          </div>
          <p className="text-gray-600">Join our community of travelers and start your adventure!</p>
        </div>

        {/* Registration Form */}
        <Card className="auth-card">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              {formData.profilePhoto ? (
                <img 
                  src={URL.createObjectURL(formData.profilePhoto)} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-purple-600" />
              )}
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                <Upload className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleFileChange(file);
                  }}
                />
              </label>
            </div>
            <CardTitle className="text-2xl text-purple-900">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-purple-900 font-medium">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-purple-900 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-purple-900 font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Your city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="text-purple-900 font-medium">
                    Country
                  </Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="Your country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additionalInfo" className="text-purple-900 font-medium">
                  Additional Information
                </Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Tell us about your travel interests, preferences, or anything else you'd like to share..."
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  className="mt-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 min-h-[100px]"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="rounded border-purple-300 text-purple-600 focus:ring-purple-500" 
                  required 
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-purple-600 hover:text-purple-700">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full purple-gradient hover:from-purple-700 hover:to-violet-700 text-white py-3 rounded-lg font-medium"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}