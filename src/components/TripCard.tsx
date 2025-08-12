import { useRouter } from 'next/navigation';
import { Calendar, MapPin,  Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TripCardProps {
  trip: {
    _id: string;
    destination: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    totalBudget: number;
  };
  status: 'ongoing' | 'previous' | 'upcoming';
}

export default function TripCard({ trip, status }: TripCardProps) {
  const router = useRouter();

  const statusColors = {
    ongoing: {
      bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
      border: 'border-green-400/30',
      shadow: 'hover:shadow-green-500/20',
      badge: 'bg-green-400/20 text-green-300',
      accent: 'text-green-400'
    },
    previous: {
      bg: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10',
      border: 'border-blue-400/30',
      shadow: 'hover:shadow-blue-500/20',
      badge: 'bg-blue-400/20 text-blue-300',
      accent: 'text-blue-400'
    },
    upcoming: {
      bg: 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10',
      border: 'border-yellow-400/30',
      shadow: 'hover:shadow-yellow-500/20',
      badge: 'bg-yellow-400/20 text-yellow-300',
      accent: 'text-yellow-400'
    }
  };

  const statusText = {
    ongoing: 'Ongoing',
    previous: 'Completed',
    upcoming: 'Upcoming'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCardClick = () => {
    router.push(`/trip/${trip._id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className={`
        group cursor-pointer rounded-3xl p-6 
        ${statusColors[status].bg}
        ${statusColors[status].border}
        ${statusColors[status].shadow}
        backdrop-blur-xl border shadow-2xl
        transition-all duration-500 hover:scale-[1.02]
      `}
      whileHover={{ 
        y: -5,
        boxShadow: status === 'ongoing' 
          ? "0 25px 50px rgba(74, 222, 128, 0.3)" 
          : status === 'upcoming'
          ? "0 25px 50px rgba(251, 191, 36, 0.3)"
          : "0 25px 50px rgba(59, 130, 246, 0.3)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header with destination and status */}
      <div className="flex justify-between items-start mb-4">
        <motion.h3 
          className="text-xl font-bold text-white group-hover:text-white/90 transition-colors"
          whileHover={{ scale: 1.02 }}
        >
          {trip.destination}
        </motion.h3>
        <span className={`
          text-xs font-medium px-3 py-1 rounded-full
          ${statusColors[status].badge}
        `}>
          {statusText[status]}
        </span>
      </div>

      {/* Trip Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-white/80 text-sm">
          <Calendar className="w-4 h-4 mr-3 text-white/60" />
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>
        
        <div className="flex items-center text-white/80 text-sm">
          <Clock className="w-4 h-4 mr-3 text-white/60" />
          <span>{trip.totalDays} days</span>
        </div>
        
        <div className="flex items-center text-white/80 text-sm">
          {/* <DollarSign className="w-4 h-4 mr-3 text-white/60" /> */}
          <span>${trip.totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <motion.span
          className={`text-sm font-medium ${statusColors[status].accent} group-hover:underline`}
          whileHover={{ x: 5 }}
        >
          View Details
        </motion.span>
        
        <motion.div
          className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"
          whileHover={{ 
            scale: 1.1,
            backgroundColor: "rgba(255, 255, 255, 0.2)"
          }}
        >
          <MapPin className="w-4 h-4 text-white/60" />
        </motion.div>
      </div>

      {/* Floating decorative element */}
      <motion.div
        className={`
          absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-20
          ${status === 'ongoing' ? 'bg-green-400' : status === 'upcoming' ? 'bg-yellow-400' : 'bg-blue-400'}
        `}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
}