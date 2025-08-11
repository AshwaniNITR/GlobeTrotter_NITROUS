'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LocationData {
  city?: string;
  state?: string;
  country?: string;
}

interface UserData {
  _id: string;
  username: string;
  email: string;
  phone: string;
  location: LocationData;
  additionalInfo: string;
  password: string;
  isVerified: boolean;
  authProvider: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  refreshToken: string;
}

export default function UserProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/fetch-all");
        const result = await response.json();
        if (result.success) {
          const userEmail = localStorage.getItem("userEmail") || "";
          const user = result.data.find((u: UserData) => u.email === userEmail);
          if (user) {
            setUserData(user);
          } else {
            setError('User not found');
          }
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError('An error occurred while fetching profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error loading profile</p>
          <p className="text-sm opacity-75">{error}</p>
        </div>
      </div>
    );
  }

  const SkeletonCard = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white/70 backdrop-blur-sm border border-purple-100/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className="h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl mb-4 animate-pulse"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gradient-to-r from-purple-200 to-indigo-200 rounded animate-pulse"></div>
        <div className="h-3 bg-gradient-to-r from-purple-150 to-indigo-150 rounded w-3/4 animate-pulse"></div>
        <div className="h-3 bg-gradient-to-r from-purple-150 to-indigo-150 rounded w-1/2 animate-pulse"></div>
      </div>
      <div className="mt-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 text-center opacity-75">
          View
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Your Profile
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* User Profile Section */}
        <div className="bg-white/70 backdrop-blur-sm border border-purple-100/50 rounded-2xl p-8 shadow-xl mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-purple-200/50 shadow-lg overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100">
                  {userData?.profilePicture ? (
                    <Image
                      src={userData.profilePicture}
                      alt="Profile Picture"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-purple-600 text-lg font-semibold">
                      {userData?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="bg-white/60 backdrop-blur-sm border border-purple-100/30 rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {userData?.username || 'GlobalTrotter'}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {userData?.additionalInfo || 'User Details with appropriate option to edit those information....'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm rounded-full shadow-md">
                    ✓ Verified
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-full shadow-md">
                    {userData?.authProvider || 'Email'} User
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preplanned Trips Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
            Preplanned Trips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <div className="relative">
              <SkeletonCard />
              {/* Alert Scorpion Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg border-2 border-white">
                Alert Scorpion
              </div>
            </div>
          </div>
        </div>

        {/* Previous Trips Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
            Previous Trips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}