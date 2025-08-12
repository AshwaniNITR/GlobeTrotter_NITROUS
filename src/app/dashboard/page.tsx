"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiPlus,  FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TripCard from '../../components/TripCard';

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

interface RecommendedTrip extends Trip {
  isRecommended?: boolean;
}

const ExoticCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Mystical Japan",
      subtitle: "Cherry blossoms & Sacred Temples",
      image: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg",
      gradient: "from-pink-400 via-purple-500 to-indigo-600"
    },
    {
      title: "Highland Dreams",
      subtitle: "Rugged Beauty & Pristine Waters",
      image: "https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg",
      gradient: "from-emerald-400 via-cyan-500 to-blue-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-80 rounded-3xl overflow-hidden mb-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient}`}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full flex items-center justify-center text-center text-white">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xl opacity-90">{slides[currentSlide].subtitle}</p>
            </motion.div>
          </div>
          
          {Array.from({ length: 20 }, () => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            x1: Math.random() * 100,
            x2: Math.random() * 100,
            y1: Math.random() * 100,
            y2: Math.random() * 100,
            duration: 3 + Math.random() * 2,
          })).map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              animate={{
                x: [particle.x1, particle.x2],
                y: [particle.y1, particle.y2],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      
     <div className="relative w-full h-[500px] overflow-hidden">
  {slides.map((slide, index) => (
    <motion.div
      key={index}
      className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ${
        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
      style={{ backgroundImage: `url(${slide.image})` }}
    >
      {/* Overlay for better text visibility */}
     

      {/* Text on top */}
      <div className="absolute bottom-20 left-10 text-amber-400 z-20">
        <h2 className="text-4xl font-bold">{slide.title}</h2>
        <p className="text-lg">{slide.subtitle}</p>
      </div>
    </motion.div>
  ))}
</div>


    </div>
  );
};

const RecommendedLocationsCarousel = ({ trips }: { trips: Trip[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const recommendedLocations = [
    'Bali, Indonesia',
    'Santorini, Greece', 
    'Kyoto, Japan',
    'Machu Picchu, Peru',
    'Grand Canyon, USA',
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recommendedLocations.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [recommendedLocations.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendedLocations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? recommendedLocations.length - 1 : prev - 1
    );
  };

// Store generated trip data so they stay constant
const locationCache: Record<string, RecommendedTrip> = {};

const getLocationData = (location: string): RecommendedTrip => {
  const existingTrip = trips.find((trip) => trip.destination === location);
  if (existingTrip) return { ...existingTrip, isRecommended: true };

  // If already generated before, return the cached value
  if (locationCache[location]) {
    return locationCache[location];
  }

  // Predefined mock data
  const mockBudgets = [1500, 2000, 2500, 3000, 3500, 4000];
  const mockDays = [5, 7, 10, 14];

  const newTrip: RecommendedTrip = {
    _id: `mock-${location}`,
    destination: location,
    startDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString(),
    totalDays: mockDays[Math.floor(Math.random() * mockDays.length)],
    totalBudget: mockBudgets[Math.floor(Math.random() * mockBudgets.length)],
    sections: [
      {
        name: "Accommodation",
        budget: Math.floor(Math.random() * 1000) + 500,
        daysToStay: Math.floor(Math.random() * 5) + 3,
        dateRange: "TBD"
      }
    ],
    isRecommended: true
  };

  // Save to cache so it doesn’t change later
  locationCache[location] = newTrip;
  return newTrip;
};


  return (
    <motion.div 
      className="mb-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-2xl font-semibold text-yellow-400 flex items-center">
          <motion.div 
            className="w-3 h-3 rounded-full bg-yellow-400 mr-3"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          Top Recommended Locations
        </h4>
        
        <div className="flex space-x-2">
          <motion.button
            onClick={prevSlide}
            className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 text-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronLeft size={18} />
          </motion.button>
          <motion.button
            onClick={nextSlide}
            className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 text-white"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.9 }}
          >
            <FiChevronRight size={18} />
          </motion.button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <motion.div 
          className="flex gap-6"
          animate={{ 
            x: `-${currentIndex * (100 / recommendedLocations.length)}%`,
            transition: { 
              type: "spring",
              stiffness: 300,
              damping: 30
            }
          }}
        >
          {recommendedLocations.map((location, index) => {
            const locationData = getLocationData(location);
            return (
              <motion.div
                key={location}
                className="flex-shrink-0 w-1/3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: Math.abs(index - currentIndex) <= 1 ? 1 : 0.9
                }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.6
                }}
                whileHover={{ 
                  scale: 1.05,
                  zIndex: 10
                }}
              >
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
                  <motion.div 
                    className="absolute top-4 right-4 z-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  >
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ RECOMMENDED
                    </div>
                  </motion.div>

                  <div className="relative h-48 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.h3 
                        className="text-2xl font-bold text-white text-center px-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {location}
                      </motion.h3>
                    </div>
                    
                    <motion.div
                      className="absolute top-6 left-6 w-4 h-4 bg-white/40 rounded-full"
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    />
                    <motion.div
                      className="absolute bottom-8 right-8 w-3 h-3 bg-yellow-400/60 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                     
                      <span className="text-sm text-yellow-400 font-semibold">
                        ${locationData.totalBudget}
                      </span>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-4">
                      Experience the magic of {location.split(',')[0]} with our curated travel experiences.
                    </p>

                    <motion.button 
                      className="w-full py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm text-white rounded-2xl border border-white/20 font-medium"
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: "rgba(168, 85, 247, 0.3)",
                        boxShadow: "0 10px 25px rgba(168, 85, 247, 0.3)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Explore Destination
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      {/* Carousel Container */}
      

      {/* Carousel Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.max(recommendedLocations.length - 2, 1) }, (_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-yellow-400 scale-125' : 'bg-white/40'
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const [profilePicture, setProfilePicture] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await fetch("/api/getMailFromCookie", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        console.log('Profile API response:', data);

        if (res.ok && data.profilePic) {
          setProfilePicture(data.profilePic);
          // Fetch trips after getting user email
          const userEmail = data.email || data.profilePic;
          console.log('Using email for trips:', userEmail);
          fetchTrips(userEmail);
        } else {
          console.error('Profile fetch error:', data);
          setError(data.error || "Something went wrong");
          setLoading(false);
        }
      } catch (err) {
        console.error('Profile fetch exception:', err);
        setError("Failed to fetch profile");
        setLoading(false);
      }
    }

    async function fetchTrips(email: string) {
      try {
        console.log('Fetching trips for email:', email);
        const response = await fetch(`/api/getTrip?userEmail=${encodeURIComponent(email)}`);
        const data = await response.json();
        
        console.log('Trips API response:', data);
        console.log('Response status:', response.status);
        
        if (response.ok && data.success) {
          console.log('Setting trips:', data.trips);
          setTrips(data.trips || []);
        } else {
          console.error('Trips fetch error:', data);
          setError(data.error || `Failed to fetch trips: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to fetch trips:', error);
        setError("Network error while fetching trips");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Categorize trips
  const currentDate = new Date();
  console.log('Current date:', currentDate);
  console.log('Total trips loaded:', trips.length);

  // Previous trips: current > endDate (trip has ended)
  const previousTrips = trips.filter(trip => {
    const endDate = new Date(trip.endDate);
    const isPrevious = currentDate > endDate;
    console.log(`Trip ${trip.destination}: end ${trip.endDate}, current > end: ${isPrevious}`);
    return isPrevious;
  });

  // Ongoing trips: startDate < current < endDate (trip is currently happening)
  const ongoingTrips = trips.filter(trip => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const isOngoing = startDate < currentDate && currentDate < endDate;
    console.log(`Trip ${trip.destination}: ${trip.startDate} to ${trip.endDate}, start < current < end: ${isOngoing}`);
    return isOngoing;
  });

  // Upcoming trips: current < startDate (trip hasn't started yet)
  const upcomingTrips = trips.filter(trip => {
    const startDate = new Date(trip.startDate);
    const isUpcoming = currentDate < startDate;
    console.log(`Trip ${trip.destination}: start ${trip.startDate}, current < start: ${isUpcoming}`);
    return isUpcoming;
  });

  console.log('Previous trips:', previousTrips.length);
  console.log('Ongoing trips:', ongoingTrips.length);
  console.log('Upcoming trips:', upcomingTrips.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ left: '10%', top: '20%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x * 0.01,
            y: -mousePosition.y * 0.01,
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ right: '10%', bottom: '20%' }}
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white font-bold text-lg">
                <Image src="/siteLogo.jpg" alt="Logo" width={40} height={40} />
              </span>
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
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-gradient-to-r from-pink-500 to-purple-500 shadow-2xl cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">SR</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.header>
      
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Exotic Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <ExoticCarousel />
        </motion.div>

        {/* Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-400/90 via-pink-500/90 to-purple-600/90 backdrop-blur-xl p-8 mb-12 border border-white/20 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg')] bg-cover bg-center opacity-20" />
          
          
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative flex-grow w-full lg:w-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-white/60 text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search for exotic destinations..."
              className="pl-12 pr-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 w-full text-white placeholder-white/60 shadow-2xl"
            />
          </div>
          
          <div className="flex space-x-4 shrink-0 flex-wrap justify-center lg:justify-end">
            {['Group by', 'Filter', 'Sort by...'].map((label, index) => (
              <motion.select 
                key={label}
                className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400/50 text-white shadow-2xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <option value="" className="bg-gray-800">{label}</option>
              </motion.select>
            ))}
          </div>
        </motion.div>

        {/* Your Trips Section */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.h3 
            className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Your Trips
          </motion.h3>

          {/* Top Recommended Locations Carousel */}
          {!loading && (
            <RecommendedLocationsCarousel trips={trips} />
          )}

          {/* Debug Info - Remove in production */}
         

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 rounded-3xl p-6 h-48"
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

          {/* Upcoming Trips */}
          {!loading && upcomingTrips.length > 0 && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <h4 className="text-2xl font-semibold text-yellow-400 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-3"></div>
                Upcoming Trips ({upcomingTrips.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips.map((trip, index) => (
                  <motion.div
                    key={trip._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                  >
                    <TripCard trip={trip} status="upcoming" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Ongoing Trips */}
          {!loading && ongoingTrips.length > 0 && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <h4 className="text-2xl font-semibold text-green-400 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-3 animate-pulse"></div>
                Ongoing Trips ({ongoingTrips.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingTrips.map((trip, index) => (
                  <motion.div
                    key={trip._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                  >
                    <TripCard trip={trip} status="ongoing" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Previous Trips */}
          {!loading && previousTrips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <h4 className="text-2xl font-semibold text-blue-400 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-3"></div>
                Previous Trips ({previousTrips.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {previousTrips.map((trip, index) => (
                  <motion.div
                    key={trip._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + index * 0.1 }}
                  >
                    <TripCard trip={trip} status="previous" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No Trips State */}
          {!loading && trips.length === 0 && (
            <motion.div
              className="text-center py-16 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
            >
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <FiPlus className="text-4xl text-white/60" />
              </motion.div>
              <h4 className="text-2xl font-semibold text-white/80 mb-4">No trips found</h4>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Start planning your first adventure and create memories that will last a lifetime.
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

          {/* Error State */}
          {error && (
            <motion.div
              className="text-center py-12 bg-red-500/10 rounded-3xl border border-red-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <h4 className="text-xl font-semibold text-red-400 mb-2">Error</h4>
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}
        </motion.section>

        {/* Floating Action Button */}
        <motion.button 
          onClick={() => router.push('/createTravel')}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-2xl z-50"
          whileHover={{ 
            scale: 1.1, 
            boxShadow: "0 20px 40px rgba(168, 85, 247, 0.6)",
            rotate: 90 
          }}
          whileTap={{ scale: 0.9 }}
          animate={{ 
            y: [0, -10, 0],
            boxShadow: [
              "0 10px 30px rgba(168, 85, 247, 0.3)",
              "0 20px 40px rgba(168, 85, 247, 0.5)",
              "0 10px 30px rgba(168, 85, 247, 0.3)"
            ]
          }}
          transition={{ 
            y: { duration: 2, repeat: Infinity },
            boxShadow: { duration: 2, repeat: Infinity }
          }}
        >
          <FiPlus size={28} />
        </motion.button>
      </main>

      {/* Footer */}
      <motion.footer 
        className="relative bg-black/40 backdrop-blur-xl border-t border-white/10 mt-20"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-indigo-900/20" />
        <div className="container mx-auto px-6 py-16 relative z-10">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Team Nitrous Branding */}
            {/* <motion.div 
              className="col-span-1 md:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 }}
            >
              <motion.div 
                className="flex items-center space-x-4 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <span className="text-white font-bold text-2xl">N</span>
                </motion.div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Team Nitrous
                  </h3>
                  <p className="text-white/70">Accelerating Digital Experiences</p>
                </div>
              </motion.div>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                Crafting extraordinary digital experiences that transcend boundaries. 
                We specialize in creating immersive, animated interfaces that captivate 
                and inspire users worldwide.
              </p>
              <motion.div 
                className="flex space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                {[
                  { icon: FiInstagram, color: 'from-pink-500 to-purple-600', handle: '@teamnitrous' },
                  { icon: FiTwitter, color: 'from-blue-400 to-blue-600', handle: '@nitrous_team' },
                  { icon: FiLinkedin, color: 'from-blue-600 to-indigo-600', handle: 'team-nitrous' },
                  { icon: FiGithub, color: 'from-gray-600 to-gray-800', handle: 'teamnitrous' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center shadow-xl group`}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 360,
                      boxShadow: "0 15px 30px rgba(255,255,255,0.2)" 
                    }}
                    whileTap={{ scale: 0.9 }}
                    title={social.handle}
                  >
                    <social.icon className="text-white text-xl group-hover:scale-110 transition-transform" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div> */}

            {/* Quick Links */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
            >
              <h4 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {['About Us', 'Services', 'Portfolio', 'Contact', 'Blog'].map((link) => (
                  <motion.li key={link}>
                    <motion.a
                      href="#"
                      className="text-white/70 hover:text-white transition-colors"
                      whileHover={{ x: 5, color: "#ffffff" }}
                    >
                      {link}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div> */}

            {/* Contact Info */}
            {/* <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1 }}
            >
              <h4 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Get In Touch
              </h4>
              <div className="space-y-4">
                <p className="text-white/70">
                  <span className="block font-semibold text-white">Email:</span>
                  hello@teamnitrous.dev
                </p>
                <p className="text-white/70">
                  <span className="block font-semibold text-white">Location:</span>
                  Worldwide Remote
                </p>
                
              </div>
            </motion.div> */}
          

          {/* Copyright */}
          <motion.div 
            className="border-t border-white/10 mt-12 pt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3 }}
          >
            <p className="text-white/60">
              © 2025 Team Nitrous. All rights reserved. Prepared with ❤ by Team Nitrous
            </p>
            <motion.div 
              className="mt-4 flex justify-center space-x-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}