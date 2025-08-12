'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import TripCard from '../../components/TripCard';
import {Lightbulb} from 'lucide-react'
import { useRouter } from 'next/navigation';

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

interface Trip {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalBudget: number;
  sections: {
    name: string;
    budget: number;
    daysToStay: number;
    dateRange: string;
  }[];
}

export default function UserProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/fetch-all");
        const result = await response.json();
        if (result.success) {
          let email = '';
          try {
            email = localStorage.getItem("userEmail") || "";
          } catch (e) {
            console.log('LocalStorage not available, trying cookie API');
          }
          
          if (!email) {
            try {
              const cookieRes = await fetch("/api/getMailFromCookie", {
                method: "GET",
                credentials: "include",
              });
              const cookieData = await cookieRes.json();
              if (cookieRes.ok) {
                email = cookieData.email || '';
              }
            } catch (e) {
              console.error('Error fetching from cookie API:', e);
            }
          }
          
          setUserEmail(email);
          
          const user = result.data.find((u: UserData) => u.email === email);
          if (user) {
            setUserData(user);
            fetchTrips(email);
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

    async function fetchTrips(email: string) {
      if (!email) {
        setTripsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/getTrip?userEmail=${encodeURIComponent(email)}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setTrips(data.trips || []);
        } else {
          console.log('No trips found or error fetching trips');
        }
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setTripsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const currentDate = new Date();
  
  const previousTrips = trips.filter(trip => {
    const endDate = new Date(trip.endDate);
    return currentDate > endDate;
  });

  const ongoingTrips = trips.filter(trip => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    return startDate < currentDate && currentDate < endDate;
  });

  const upcomingTrips = trips.filter(trip => {
    const startDate = new Date(trip.startDate);
    return currentDate < startDate;
  });

  const SkeletonCard = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <div className="h-32 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-pink-500/10 rounded-xl mb-4 animate-pulse"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded animate-pulse"></div>
        <div className="h-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded w-3/4 animate-pulse"></div>
        <div className="h-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded w-1/2 animate-pulse"></div>
      </div>
      <div className="mt-6">
        <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-white/50 px-6 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 text-center opacity-75">
          View
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-indigo-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-pink-500 border-l-violet-500 animate-spin animation-delay-200"></div>
          </div>
          <p className="text-white/80 font-medium">Loading your travel profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error loading profile</h3>
          <p className="text-white/70 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 pb-20">
      {/* Glassmorphic Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
              Travel Profile
            </h1>
            <div className="flex items-center space-x-4">
              {/* <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/90 transition-all duration-300 hover:shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button> */}
              <button onClick={() => router.push('/admin')} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/90 transition-all duration-300 hover:shadow-lg">
                <Lightbulb className="w-5 h-5" />
              </button>
              <button onClick={() => router.push('/communitySection')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
         Community Page
        </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* User Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-slate-900/40 backdrop-blur-lg border border-white/10 rounded-3xl p-8 shadow-2xl mb-12 hover:shadow-purple-500/20 transition-all duration-500"
        >
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Profile Picture with Glow Effect */}
            <div className="flex-shrink-0 relative">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-75 blur-lg animate-pulse"></div>
                <div className="relative w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-gradient-to-br from-purple-500/30 via-indigo-500/30 to-pink-500/30">
                  {userData?.profilePicture ? (
                    <Image
                      src={userData.profilePicture}
                      alt="Profile Picture"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-semibold">
                      {userData?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-slate-900 shadow-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {userData?.username || 'GlobalTrotter'}
                    </h2>
                    <p className="text-purple-200/90 mb-2">
                      {userData?.email}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                    Edit Profile
                  </button>
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  {userData?.additionalInfo || 'Adventure enthusiast exploring the world one trip at a time. Currently planning my next journey to unknown destinations.'}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-400/30 text-white text-sm rounded-full shadow-md backdrop-blur-sm">
                    ✈️ {userData?.isVerified ? 'Verified Traveler' : 'Unverified'}
                  </span>
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border border-blue-400/30 text-white text-sm rounded-full shadow-md backdrop-blur-sm">
                    {userData?.authProvider || 'Email'} Account
                  </span>
                  <span className="px-4 py-1.5 bg-gradient-to-r from-pink-600/30 to-rose-600/30 border border-pink-400/30 text-white text-sm rounded-full shadow-md backdrop-blur-sm">
                    Member since {new Date(userData?.createdAt || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {/* Total Trips Card */}
          <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300/80 mb-1">Total Trips</p>
                <h3 className="text-3xl font-bold text-white">{trips.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-purple-200/60">Across {new Set(trips.map(t => t.destination)).size} destinations</p>
            </div>
          </div>

          {/* Upcoming Trips Card */}
          <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-yellow-500/20 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-300/80 mb-1">Upcoming</p>
                <h3 className="text-3xl font-bold text-white">{upcomingTrips.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-amber-200/60">Next trip: {upcomingTrips[0]?.destination || 'None planned'}</p>
            </div>
          </div>

          {/* Countries Visited Card */}
          <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-pink-500/20 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-pink-300/80 mb-1">Days Traveling</p>
                <h3 className="text-3xl font-bold text-white">{trips.reduce((sum, trip) => sum + trip.totalDays, 0)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-pink-600/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-pink-200/60">That is {Math.round(trips.reduce((sum, trip) => sum + trip.totalDays, 0)) / 365 * 100}% of a year!</p>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Trips Section */}
        {upcomingTrips.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full"></div>
                Upcoming Adventures
              </h2>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium">
                {upcomingTrips.length} trips
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTrips.map((trip, index) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <TripCard trip={trip} status="upcoming" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Ongoing Trips Section */}
        {ongoingTrips.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-green-500 rounded-full"></div>
                Current Journeys
              </h2>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium">
                {ongoingTrips.length} active
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingTrips.map((trip, index) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <TripCard trip={trip} status="ongoing" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Previous Trips Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
              Travel Memories
            </h2>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium">
              {previousTrips.length} experiences
            </span>
          </div>
          
          {tripsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : previousTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previousTrips.map((trip, index) => (
                <motion.div
                  key={trip._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <TripCard trip={trip} status="previous" />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center py-16 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-purple-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No past adventures yet</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">Your travel stories are waiting to be written. Start planning your first trip!</p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center mx-auto">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Plan Your First Trip
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Floating Action Button with Glow */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        className="fixed bottom-8 right-8 z-10"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-75 blur-md transition-all duration-500"></div>
          <button className="relative w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              opacity: [0, Math.random() * 0.03 + 0.01, 0],
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              background: `radial-gradient(circle, rgba(${
                Math.random() > 0.5 ? '124, 58, 237' : '99, 102, 241'
              }, ${Math.random() * 0.3 + 0.1})`,
              filter: 'blur(40px)'
            }}
          />
        ))}
      </div>
    </div>
  );
}