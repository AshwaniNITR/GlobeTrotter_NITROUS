"use client";

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  MapPin,
  Image as ImageIcon,
  ArrowLeft,
  Upload
} from 'lucide-react';
import Link from 'next/link';

export default function NewTripPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    coverPhoto: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, coverPhoto: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Creating trip:', formData);
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/trips">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trips
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Plan a New Trip</h1>
            <p className="text-gray-600 mt-2">
              Start planning your next adventure by providing some basic details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Trip Name */}
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Trip Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Tokyo Adventure, European Explorer"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Give your trip a memorable name
                    </p>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                        Start Date *
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                        End Date *
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="mt-1"
                        min={formData.startDate}
                        required
                      />
                    </div>
                  </div>

                  {/* Duration Display */}
                  {calculateDays() > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center text-blue-800">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span className="font-medium">
                          Duration: {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Tell us about your trip goals, interests, or any special plans..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="mt-1 min-h-[100px]"
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional: Add context to help personalize your experience
                    </p>
                  </div>

                  {/* Cover Photo Upload */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Cover Photo (Optional)
                    </Label>
                    <div className="mt-2">
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                        <div className="space-y-1 text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleFileChange(file);
                                }}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                          {formData.coverPhoto && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ {formData.coverPhoto.name} selected
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                    <Link href="/trips" className="flex-1">
                      <Button type="button" variant="outline" className="w-full">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" className="flex-1">
                      Create Trip
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trip Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">
                      {formData.name || 'Untitled Trip'}
                    </p>
                  </div>
                  {(formData.startDate || formData.endDate) && (
                    <div>
                      <p className="text-sm text-gray-500">Dates</p>
                      <p className="font-medium">
                        {formData.startDate && new Date(formData.startDate).toLocaleDateString()}
                        {formData.startDate && formData.endDate && ' - '}
                        {formData.endDate && new Date(formData.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {calculateDays() > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">
                        {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
                      </p>
                    </div>
                  )}
                  {formData.description && (
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {formData.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Create your trip</p>
                      <p className="text-gray-500">Provide basic information</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-400">Add destinations</p>
                      <p className="text-gray-400">Choose cities to visit</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-400">Plan activities</p>
                      <p className="text-gray-400">Build your itinerary</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs font-medium">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-gray-400">Review & share</p>
                      <p className="text-gray-400">Finalize and share</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}