"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiInstagram, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { routeModule } from 'next/dist/build/templates/app-page';
import { useRouter } from 'next/navigation';

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
      title: "Alpine Paradise",
      subtitle: "Crystal Lakes & Majestic Peaks",
      image: "https://images.pexels.com/photos/147411/italy-mountains-clouds-sky-147411.jpeg",
      gradient: "from-blue-400 via-teal-500 to-green-600"
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
  // const router = useRouter(); // Remove this line from ExoticCarousel
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
          
          {/* Floating particles */}
          {(() => {
            // Precompute random positions and animation values for each particle
            const particles = Array.from({ length: 20 }, () => ({
              left: Math.random() * 100,
              top: Math.random() * 100,
              x1: Math.random() * 100,
              x2: Math.random() * 100,
              y1: Math.random() * 100,
              y2: Math.random() * 100,
              duration: 3 + Math.random() * 2,
            }));
            return particles.map((particle, i) => (
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
            ));
          })()}
        </motion.div>
      </AnimatePresence>
      
      {/* Carousel indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
const [profilePicture, setProfilePicture] = useState('');
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
const [error, setError] = useState<string | null>(null);
const router = useRouter();

useEffect(() => {
  async function fetchUserProfile() {
    try {
      const res = await fetch("/api/getMailFromCookie", {
        method: "GET",
        credentials: "include", // important for cookies
      });

      const data = await res.json();

      if (res.ok && data.profilePic) {
        setProfilePicture(data.profilePic);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to fetch profile");
    }
  }

  fetchUserProfile();

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);


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
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-gradient-to-r from-pink-500 to-purple-500 shadow-2xl"
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
          <motion.div 
            className="absolute right-8 top-8"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
          >
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-2xl" />
          </motion.div>
          <div className="relative z-10">
            <motion.h2 
              className="text-4xl font-bold text-transparent mb-3 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Antique Giraffe
            </motion.h2>
            <motion.p 
              className="text-white/90 mb-6 text-lg"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Banner Alert Okapi e
            </motion.p>
            <motion.button 
              className="px-8 py-3 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white rounded-2xl border border-white/30 font-semibold shadow-2xl"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Explore Now
            </motion.button>
          </div>
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

        {/* Sections */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.h3 
            className="text-2xl font-bold text-white mb-8 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Top Regional Selections
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <motion.div 
                key={item}
                className="group bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 border border-white/10"
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5, 
                  boxShadow: "0 25px 50px rgba(168, 85, 247, 0.4)" 
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <motion.div 
                  className="h-48 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-2xl mb-4 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg')] bg-cover bg-center opacity-60" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
                <h4 className="font-bold text-white text-lg group-hover:text-pink-200 transition-colors">
                  Brave Salmon
                </h4>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.h3 
            className="text-2xl font-bold text-white mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Previous Trips
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <motion.div 
                key={item}
                className="group bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-white/10"
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: -5, 
                  boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)" 
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <motion.div 
                  className="h-48 bg-gradient-to-br from-blue-400/20 to-teal-500/20 rounded-2xl mb-4 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg')] bg-cover bg-center opacity-60" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </motion.div>
                <h4 className="font-bold text-white text-lg group-hover:text-blue-200 transition-colors">
                  Remarkable Emu
                </h4>
                <p className="text-white/70 text-sm mt-2">Sanskriti Rai</p>
              </motion.div>
            ))}
          </div>
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

      {/* Elaborate Team Nitrous Footer */}
      <motion.footer 
        className="relative bg-black/40 backdrop-blur-xl border-t border-white/10 mt-20"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
      </motion.footer>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-indigo-900/20" />
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Team Nitrous Branding */}
            <motion.div 
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
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
            >
              <h4 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {['About Us', 'Services', 'Portfolio', 'Contact', 'Blog'].map((link, index) => (
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
            </motion.div>

            {/* Contact Info */}
            <motion.div
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
                <motion.button
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-xl"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 15px 30px rgba(168, 85, 247, 0.4)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Project
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div 
            className="border-t border-white/10 mt-12 pt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3 }}
          >
            <p className="text-white/60">
              © 2024 Team Nitrous. All rights reserved. Prepared with ❤ by Team Nitrous
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
    </div>

  );
}