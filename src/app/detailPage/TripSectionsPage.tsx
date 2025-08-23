"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiMapPin, FiCalendar, FiDollarSign, FiClock, FiUsers, FiHome, FiCamera, FiShoppingBag, FiCoffee } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  _id?: string;
  name: string;
  budget: number;
  daysToStay: number;
  dateRange: string;
  isEditable?: boolean;
  accommodation?: string;
}

interface Trip {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalBudget: number;
  sections: Section[];
  userEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Section Card Component
const SectionCard = ({ section, index }: { section: Section; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCardGradient = (index: number) => {
    const gradients = [
      'from-purple-500/20 to-blue-600/20',
      'from-blue-500/20 to-teal-600/20',
      'from-teal-500/20 to-green-600/20',
      'from-green-500/20 to-yellow-600/20',
      'from-yellow-500/20 to-orange-600/20',
      'from-orange-500/20 to-red-600/20',
      'from-red-500/20 to-pink-600/20',
      'from-pink-500/20 to-purple-600/20'
    ];
    return gradients[index % gradients.length];
  };

  const getBorderColor = (index: number) => {
    const colors = [
      'border-purple-400/30',
      'border-blue-400/30',
      'border-teal-400/30',
      'border-green-400/30',
      'border-yellow-400/30',
      'border-orange-400/30',
      'border-red-400/30',
      'border-pink-400/30'
    ];
    return colors[index % colors.length];
  };

  const getAccentColor = (index: number) => {
    const colors = [
      'text-purple-400',
      'text-blue-400',
      'text-teal-400',
      'text-green-400',
      'text-yellow-400',
      'text-orange-400',
      'text-red-400',
      'text-pink-400'
    ];
    return colors[index % colors.length];
  };

  return (
    <motion.div
      className={`bg-gradient-to-br ${getCardGradient(index)} backdrop-blur-xl rounded-3xl border ${getBorderColor(index)} overflow-hidden shadow-2xl`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
      }}
    >
      {/* Section Number Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`bg-gradient-to-r from-white/20 to-white/10 text-white text-sm font-bold px-3 py-1 rounded-full backdrop-blur-sm border border-white/20`}>
          Stop #{index + 1}
        </div>
      </div>

      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-black/20 to-black/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
              <FiMapPin className={`mr-3 ${getAccentColor(index)}`} />
              {section.name}
            </h3>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <FiClock className={`mx-auto mb-1 ${getAccentColor(index)}`} />
            <div className="text-xs text-white/70">Days</div>
            <div className="font-bold text-white">{section.daysToStay}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <FiDollarSign className={`mx-auto mb-1 ${getAccentColor(index)}`} />
            <div className="text-xs text-white/70">Budget</div>
            <div className="font-bold text-white">${section.budget}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <FiCalendar className={`mx-auto mb-1 ${getAccentColor(index)}`} />
            <div className="text-xs text-white/70">Per Day</div>
            <div className="font-bold text-white">${Math.round(section.budget / section.daysToStay)}</div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        {/* Date Range */}
        <div className="flex items-center text-white/80 mb-4">
          <FiCalendar className={`mr-3 ${getAccentColor(index)}`} />
          <div>
            <span className="text-sm text-white/60">Duration</span>
            <div className="font-semibold">
              {section.dateRange || 'Dates to be confirmed'}
            </div>
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="bg-white/5 rounded-2xl p-4 mb-4">
          <h4 className="text-white/80 font-semibold mb-3 flex items-center">
            <FiDollarSign className={`mr-2 ${getAccentColor(index)}`} />
            Budget Breakdown
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-white/70 flex items-center">
                <FiHome className="mr-2" />
                Accommodation
              </span>
              <span className="text-white font-semibold">
                ${Math.round(section.budget * 0.4)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 flex items-center">
                <FiCoffee className="mr-2" />
                Food & Dining
              </span>
              <span className="text-white font-semibold">
                ${Math.round(section.budget * 0.3)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 flex items-center">
                <FiCamera className="mr-2" />
                Activities
              </span>
              <span className="text-white font-semibold">
                ${Math.round(section.budget * 0.2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 flex items-center">
                <FiShoppingBag className="mr-2" />
                Miscellaneous
              </span>
              <span className="text-white font-semibold">
                ${Math.round(section.budget * 0.1)}
              </span>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-3 text-center text-white/80 hover:text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-300 font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isExpanded ? 'Show Less' : 'Show More Details'}
        </motion.button>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4"
            >
              {/* Accommodation */}
              <div className="bg-white/5 rounded-2xl p-4">
                <h5 className="text-white font-semibold mb-2 flex items-center">
                  <FiHome className={`mr-2 ${getAccentColor(index)}`} />
                  Accommodation Options
                </h5>
                <p className="text-white/70 text-sm">
                  {section.accommodation || 'Hotels, hostels, or local accommodations based on budget preferences.'}
                </p>
              </div>

              {/* Activities */}
              <div className="bg-white/5 rounded-2xl p-4">
                <h5 className="text-white font-semibold mb-2 flex items-center">
                  <FiCamera className={`mr-2 ${getAccentColor(index)}`} />
                  Suggested Activities
                </h5>
                <p className="text-white/70 text-sm">
                  Sightseeing, local experiences, cultural activities, and adventure sports.
                </p>
              </div>

              {/* Transportation */}
              <div className="bg-white/5 rounded-2xl p-4">
                <h5 className="text-white font-semibold mb-2 flex items-center">
                  <FiUsers className={`mr-2 ${getAccentColor(index)}`} />
                  Transportation
                </h5>
                <p className="text-white/70 text-sm">
                  Local transport, cabs, public transportation, or rental vehicles.
                </p>
              </div>

              {/* Additional Info */}
              {section.isEditable && (
                <div className="bg-white/5 rounded-2xl p-4">
                  <h5 className="text-white font-semibold mb-2">Status</h5>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                    Customizable Section
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function TripSectionsPage() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  console.log("UserEmail in DetailPage:", userEmail);
  const searchParams = useSearchParams();
  const destination = searchParams.get('query');

  useEffect(() => {
    if (!destination) {
      setError("No destination specified");
      setLoading(false);
      return;
    }

    fetchUserAndTripData();
  }, [destination]);

  const fetchUserAndTripData = async () => {
    try {
      // First, get the user email from cookie
      const userResponse = await fetch("/api/getMailFromCookie", {
        method: "GET",
        credentials: "include",
      });

      const userData = await userResponse.json();
      
      if (!userResponse.ok) {
        setError(userData.error || "Failed to get user data");
        setLoading(false);
        return;
      }

      const email = userData.email || userData.profilePic;
      setUserEmail(email);

      // Then fetch the trip data for this destination
      await fetchTripData(email);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user profile");
      setLoading(false);
    }
  };

  const fetchTripData = async (email: string) => {
    try {
      const response = await fetch(`/api/getTrip?userEmail=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || `Failed to fetch trips: ${response.status}`);
        setLoading(false);
        return;
      }

      if (data.success && data.trips) {
        // Find the trip that matches the destination
        const matchingTrip = data.trips.find((trip: Trip) => 
          trip.destination.toLowerCase() === destination?.toLowerCase()
        );

        if (matchingTrip) {
          setTrip(matchingTrip);
        } else {
          setError(`No trip found for destination: ${destination}`);
        }
      } else {
        setError("No trips found");
      }
    } catch (err) {
      console.error("Error fetching trip data:", err);
      setError("Network error while fetching trip details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const goBack = () => {
    // In real app, this would use router.back() or router.push('/trips')
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-white/20 border-t-white/80 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white/80 text-lg">Loading trip details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          className="text-center p-8 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            {!destination ? "Invalid Request" : "Trip Not Found"}
          </h3>
          <p className="text-white/70 mb-6">
            {error || `No trip found for destination: ${destination}`}
          </p>
          <button
            onClick={goBack}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={goBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft className="text-xl text-white" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                Trip Sections
              </h1>
              <p className="text-white/60 text-sm">Detailed itinerary breakdown</p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-8">
        {/* Trip Overview */}
        <motion.div
          className="mb-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                {trip.destination}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/10 rounded-xl p-4">
                  <FiCalendar className="mx-auto mb-2 text-blue-400 text-xl" />
                  <div className="text-xs text-white/70">Duration</div>
                  <div className="font-bold text-white">{trip.totalDays} Days</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <FiDollarSign className="mx-auto mb-2 text-green-400 text-xl" />
                  <div className="text-xs text-white/70">Total Budget</div>
                  <div className="font-bold text-white">${trip.totalBudget}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <FiMapPin className="mx-auto mb-2 text-pink-400 text-xl" />
                  <div className="text-xs text-white/70">Sections</div>
                  <div className="font-bold text-white">{trip.sections.length}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <FiClock className="mx-auto mb-2 text-yellow-400 text-xl" />
                  <div className="text-xs text-white/70">Per Day</div>
                  <div className="font-bold text-white">${Math.round(trip.totalBudget / trip.totalDays)}</div>
                </div>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <p className="text-white/70 text-sm mb-2">Trip Dates</p>
              <p className="text-white font-semibold">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections Timeline */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-3xl font-bold text-white mb-2">Itinerary Breakdown</h3>
          <p className="text-white/60 text-lg">
            Explore each section of your {trip.destination} adventure
          </p>
        </motion.div>

        {/* Sections Grid */}
        {trip.sections && trip.sections.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {trip.sections.map((section, index) => (
              <SectionCard
                key={section._id || index}
                section={section}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FiMapPin className="text-4xl text-white/40 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white/80 mb-2">No sections found</h4>
            <p className="text-white/60">This trip doesn not have any detailed sections yet.</p>
          </motion.div>
        )}

        {/* Trip Summary */}
        {trip.sections && trip.sections.length > 0 && (
          <motion.div
            className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-white/20 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">Trip Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  ${trip.sections.reduce((sum, section) => sum + section.budget, 0)}
                </div>
                <div className="text-white/70">Total Section Budgets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {trip.sections.reduce((sum, section) => sum + section.daysToStay, 0)}
                </div>
                <div className="text-white/70">Total Section Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  ${Math.round(trip.totalBudget / trip.sections.length)}
                </div>
                <div className="text-white/70">Average per Section</div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}