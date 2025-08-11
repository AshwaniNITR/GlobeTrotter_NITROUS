"use client";

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  User,
  MapPin,
  Calendar,
  Camera,
  Edit,
  Settings,
  Heart,
  Star,
  Plane
} from 'lucide-react';

const sampleTrips = [
  {
    id: 1,
    name: "Tokyo Adventure",
    image: "https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg",
    status: "completed",
    rating: 5
  },
  {
    id: 2,
    name: "European Explorer", 
    image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
    status: "upcoming"
  },
  {
    id: 3,
    name: "Bali Getaway",
    image: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg", 
    status: "ongoing"
  }
];

const savedDestinations = [
  { name: "Santorini", country: "Greece", saved: true },
  { name: "Kyoto", country: "Japan", saved: true },
  { name: "Reykjavik", country: "Iceland", saved: true },
  { name: "Dubai", country: "UAE", saved: true }
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    city: "San Francisco",
    country: "USA",
    bio: "Passionate traveler exploring the world one destination at a time. Love discovering hidden gems and local cultures.",
    joinDate: "January 2023"
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="border-purple-200">
              <CardContent className="p-6">
                {/* Profile Photo */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-16 h-16 text-purple-600" />
                    </div>
                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  {!isEditing ? (
                    <div>
                      <h2 className="text-2xl font-bold text-purple-900 mb-1">{userInfo.name}</h2>
                      <p className="text-gray-600 flex items-center justify-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {userInfo.city}, {userInfo.country}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 flex items-center justify-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {userInfo.joinDate}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                        className="text-center font-bold border-purple-200"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={userInfo.city}
                          onChange={(e) => setUserInfo({...userInfo, city: e.target.value})}
                          placeholder="City"
                          className="border-purple-200"
                        />
                        <Input
                          value={userInfo.country}
                          onChange={(e) => setUserInfo({...userInfo, country: e.target.value})}
                          placeholder="Country"
                          className="border-purple-200"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <Label className="text-purple-900 font-medium mb-2 block">About</Label>
                  {!isEditing ? (
                    <p className="text-gray-700 text-sm leading-relaxed">{userInfo.bio}</p>
                  ) : (
                    <textarea
                      value={userInfo.bio}
                      onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                      className="w-full p-3 border border-purple-200 rounded-lg text-sm resize-none"
                      rows={4}
                    />
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div>
                    <Label className="text-purple-900 font-medium">Email</Label>
                    {!isEditing ? (
                      <p className="text-gray-700 text-sm">{userInfo.email}</p>
                    ) : (
                      <Input
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        className="border-purple-200 mt-1"
                      />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!isEditing ? (
                    <>
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="w-full purple-gradient hover:from-purple-700 hover:to-violet-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </>
                  ) : (
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSave}
                        className="flex-1 purple-gradient hover:from-purple-700 hover:to-violet-700"
                      >
                        Save
                      </Button>
                      <Button 
                        onClick={() => setIsEditing(false)}
                        variant="outline" 
                        className="flex-1 border-purple-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Travel Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Plane className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">12</p>
                  <p className="text-sm text-gray-600">Trips</p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">8</p>
                  <p className="text-sm text-gray-600">Countries</p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">4.8</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">24</p>
                  <p className="text-sm text-gray-600">Saved</p>
                </CardContent>
              </Card>
            </div>

            {/* My Trips */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center">
                  <Plane className="w-5 h-5 mr-2" />
                  My Trips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sampleTrips.map((trip) => (
                    <div key={trip.id} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={trip.image} 
                          alt={trip.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity"></div>
                        <div className="absolute top-2 left-2">
                          <Badge 
                            className={
                              trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                              trip.status === 'ongoing' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }
                          >
                            {trip.status}
                          </Badge>
                        </div>
                        {trip.rating && (
                          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                            <span className="text-xs font-medium">{trip.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 font-medium text-purple-900">{trip.name}</p>
                      <Button size="sm" variant="outline" className="mt-2 w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Saved Destinations */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-900 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Saved Destinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedDestinations.map((dest, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                      <div>
                        <p className="font-medium text-purple-900">{dest.name}</p>
                        <p className="text-sm text-gray-600">{dest.country}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}