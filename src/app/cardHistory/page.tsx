"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiCalendar, FiMapPin, FiDollarSign, FiClock, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link'

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

// Enhanced Trip Card Component
const EnhancedTripCard = ({ trip, status }: { trip: Trip; status: 'ongoing' | 'upcoming' | 'completed' }) => {
  const router = useRouter();
  
  const getStatusConfig = () => {
    switch (status) {
      case 'ongoing':
        return {
          badge: 'Currently Traveling',
          badgeColor: 'bg-green-500',
          gradient: 'from-green-400/20 to-emerald-500/20',
          border: 'border-green-400/30',
          icon: '🏃‍♂️'
        };
      case 'upcoming':
        return {
          badge: 'Upcoming Adventure',
          badgeColor: 'bg-yellow-500',
          gradient: 'from-yellow-400/20 to-orange-500/20',
          border: 'border-yellow-400/30',
          icon: '⏳'
        };
      case 'completed':
        return {
          badge: 'Trip Completed',
          badgeColor: 'bg-blue-500',
          gradient: 'from-blue-400/20 to-purple-500/20',
          border: 'border-blue-400/30',
          icon: '✅'
        };
      default:
        return {
          badge: 'Trip',
          badgeColor: 'bg-gray-500',
          gradient: 'from-gray-400/20 to-gray-500/20',
          border: 'border-gray-400/30',
          icon: '📍'
        };
    }
  };

  const config = getStatusConfig();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilTrip = () => {
    const startDate = new Date(trip.startDate);
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `${diffDays} days to go`;
    if (diffDays === 0) return 'Starts today!';
    return null;
  };

  const getDaysRemaining = () => {
    const endDate = new Date(trip.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `${diffDays} days left`;
    return null;
  };

  return (
    <motion.div
      className={`relative bg-gradient-to-br ${config.gradient} backdrop-blur-xl rounded-3xl border ${config.border} overflow-hidden shadow-2xl group cursor-pointer`}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/detailPage?query=${trip.destination}`)}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`${config.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1`}>
          <span>{config.icon}</span>
          <span>{config.badge}</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative p-6 bg-gradient-to-r from-purple-600/30 to-pink-600/30">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
            <FiMapPin className="mr-2 text-yellow-400" />
            {trip.destination}
          </h3>
          
          {status === 'upcoming' && getDaysUntilTrip() && (
            <div className="text-yellow-300 font-semibold text-sm">
              {getDaysUntilTrip()}
            </div>
          )}
          
          {status === 'ongoing' && getDaysRemaining() && (
            <div className="text-green-300 font-semibold text-sm">
              {getDaysRemaining()}
            </div>
          )}
        </div>
      </div>

      {/* Trip Details */}
      <div className="p-6 space-y-4">
        {/* Date Range */}
        <div className="flex items-center text-white/80">
          <FiCalendar className="mr-3 text-blue-400" />
          <div>
            <span className="text-sm text-white/60">Duration</span>
            <div className="font-semibold">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </div>
          </div>
        </div>

        {/* Trip Duration */}
        <div className="flex items-center text-white/80">
          <FiClock className="mr-3 text-green-400" />
          <div>
            <span className="text-sm text-white/60">Total Days</span>
            <div className="font-semibold">{trip.totalDays} days</div>
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-center text-white/80">
          <FiDollarSign className="mr-3 text-yellow-400" />
          <div>
            <span className="text-sm text-white/60">Budget</span>
            <div className="font-semibold">${trip.totalBudget.toLocaleString()}</div>
          </div>
        </div>

        {/* Sections Preview */}
        {trip.sections && trip.sections.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-white/60">Destinations</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {trip.sections.slice(0, 3).map((section, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
                >
                  {section.name}
                </span>
              ))}
              {trip.sections.length > 3 && (
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/60">
                  +{trip.sections.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <motion.div 
          className="flex items-center justify-between pt-4 border-t border-white/10"
          whileHover={{ x: 5 }}
        >
          <Link href={`/detailPage?query=${trip.destination}`} className="text-white/80 font-medium">View Details</Link>
          <FiChevronRight className="text-white/60 group-hover:text-white transition-colors" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function TripListingPage() {
  const [profilePicture, setProfilePicture] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const router = useRouter();

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await fetch("/api/getMailFromCookie", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        
        if (res.ok && data.profilePic) {
          setProfilePicture(data.profilePic);
          const userEmail = data.email || data.profilePic;
          fetchTrips(userEmail);
        } else {
          setError(data.error || "Something went wrong");
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to fetch profile");
        setLoading(false);
      }
    }

    async function fetchTrips(email: string) {
      try {
        const response = await fetch(`/api/getTrip?userEmail=${encodeURIComponent(email)}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setTrips(data.trips || []);
        } else {
          setError(data.error || `Failed to fetch trips: ${response.status}`);
        }
      } catch (error) {
        setError("Network error while fetching trips");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  // Filter and categorize trips
  const currentDate = new Date();
  
  const categorizeTrips = () => {
    let filteredTrips = trips;

    // Apply search filter
    if (searchQuery) {
      filteredTrips = filteredTrips.filter(trip => 
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Categorize trips
    const ongoingTrips = filteredTrips.filter(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      return startDate <= currentDate && currentDate <= endDate;
    });

    const upcomingTrips = filteredTrips.filter(trip => {
      const startDate = new Date(trip.startDate);
      return currentDate < startDate;
    });

    const completedTrips = filteredTrips.filter(trip => {
      const endDate = new Date(trip.endDate);
      return currentDate > endDate;
    });

    // Apply sorting
    const sortTrips = (tripList: Trip[]) => {
      return [...tripList].sort((a, b) => {
        switch (sortBy) {
          case 'date':
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          case 'destination':
            return a.destination.localeCompare(b.destination);
          case 'budget':
            return a.totalBudget - b.totalBudget;
          case 'duration':
            return a.totalDays - b.totalDays;
          default:
            return 0;
        }
      });
    };

    return {
      ongoing: sortTrips(ongoingTrips),
      upcoming: sortTrips(upcomingTrips),
      completed: sortTrips(completedTrips)
    };
  };

  const categorizedTrips = categorizeTrips();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push('/dashboard')}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white font-bold text-lg">GT</span>
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
              GlobalTrotter
            </h1>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              onClick={() => router.push('/userProfile')}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-gradient-to-r from-pink-500 to-purple-500 shadow-2xl cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">U</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
            Your Trip Collection
          </h2>
          <p className="text-white/60 text-lg">
            Manage and explore all your travel adventures
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative flex-grow w-full lg:w-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-white/60 text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 w-full text-white placeholder-white/60 shadow-2xl"
            />
          </div>
          
          <div className="flex space-x-4 shrink-0 flex-wrap justify-center lg:justify-end">
            <motion.select 
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 text-white shadow-2xl"
              whileHover={{ scale: 1.02 }}
            >
              <option value="all" className="bg-gray-800">All Trips</option>
              <option value="ongoing" className="bg-gray-800">Ongoing</option>
              <option value="upcoming" className="bg-gray-800">Upcoming</option>
              <option value="completed" className="bg-gray-800">Completed</option>
            </motion.select>
            
            <motion.select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 text-white shadow-2xl"
              whileHover={{ scale: 1.02 }}
            >
              <option value="date" className="bg-gray-800">Sort by Date</option>
              <option value="destination" className="bg-gray-800">Sort by Destination</option>
              <option value="budget" className="bg-gray-800">Sort by Budget</option>
              <option value="duration" className="bg-gray-800">Sort by Duration</option>
            </motion.select>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-white/10 rounded-3xl p-6 h-80"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                <div className="h-6 bg-white/20 rounded-full w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-white/15 rounded-full w-1/2 mb-2 animate-pulse"></div>
                <div className="h-4 bg-white/15 rounded-full w-2/3 mb-2 animate-pulse"></div>
                <div className="h-4 bg-white/15 rounded-full w-1/3 animate-pulse"></div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            className="text-center py-12 bg-red-500/10 rounded-3xl border border-red-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h4 className="text-xl font-semibold text-red-400 mb-2">Error</h4>
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Trip Sections */}
        {!loading && !error && (
          <div className="space-y-12">
            {/* Ongoing Trips */}
            {(filterBy === 'all' || filterBy === 'ongoing') && categorizedTrips.ongoing.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center mb-8">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-4 animate-pulse"></div>
                  <h3 className="text-3xl font-bold text-green-400">
                    Ongoing ({categorizedTrips.ongoing.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizedTrips.ongoing.map((trip, index) => (
                    <motion.div
                      key={trip._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <EnhancedTripCard trip={trip} status="ongoing" />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Upcoming Trips */}
            {(filterBy === 'all' || filterBy === 'upcoming') && categorizedTrips.upcoming.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center mb-8">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-4"></div>
                  <h3 className="text-3xl font-bold text-yellow-400">
                    Upcoming ({categorizedTrips.upcoming.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizedTrips.upcoming.map((trip, index) => (
                    <motion.div
                      key={trip._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <EnhancedTripCard trip={trip} status="upcoming" />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Completed Trips */}
            {(filterBy === 'all' || filterBy === 'completed') && categorizedTrips.completed.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center mb-8">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
                  <h3 className="text-3xl font-bold text-blue-400">
                    Completed ({categorizedTrips.completed.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizedTrips.completed.map((trip, index) => (
                    <motion.div
                      key={trip._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <EnhancedTripCard trip={trip} status="completed" />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* No Trips State */}
            {trips.length === 0 && (
              <motion.div
                className="text-center py-20 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <FiMapPin className="text-4xl text-white/60" />
                </motion.div>
                <h4 className="text-2xl font-semibold text-white/80 mb-4">No trips found</h4>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  Start planning your adventures and create memories that will last a lifetime.
                </p>
                <motion.button
                  onClick={() => router.push('/createTravel')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-xl"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create Your First Trip
                </motion.button>
              </motion.div>
            )}

            {/* No Results for Filter */}
            {trips.length > 0 && 
             categorizedTrips.ongoing.length === 0 && 
             categorizedTrips.upcoming.length === 0 && 
             categorizedTrips.completed.length === 0 && (
              <motion.div
                className="text-center py-16 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FiSearch className="text-4xl text-white/40 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white/80 mb-2">No trips match your search</h4>
                <p className="text-white/60">Try adjusting your search terms or filters.</p>
              </motion.div>
            )}
          </div>
        )}
        <button onClick={() => router.push('/dashboard')} className="m-4 px-4 py-2 flex items-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/90 transition-all duration-300 hover:shadow-lg">
          Go To Dashboard
        </button>
      </main>
    </div>
  );
}