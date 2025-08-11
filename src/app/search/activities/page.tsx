"use client";

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  Plus,
  Camera,
  Utensils,
  Mountain,
  Building,
  Waves,
  TreePine
} from 'lucide-react';

const activities = [
  {
    id: 1,
    name: "Tokyo Food Tour",
    location: "Tokyo, Japan",
    type: "Food & Drink",
    duration: "3 hours",
    price: 85,
    rating: 4.9,
    reviews: 234,
    description: "Explore authentic Japanese cuisine with a local guide through hidden gems",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
    tags: ["Food", "Culture", "Walking"]
  },
  {
    id: 2,
    name: "Eiffel Tower Skip-the-Line",
    location: "Paris, France", 
    type: "Sightseeing",
    duration: "2 hours",
    price: 45,
    rating: 4.7,
    reviews: 1205,
    description: "Skip the crowds and enjoy panoramic views of Paris from the iconic tower",
    image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
    tags: ["Landmark", "Views", "Photography"]
  },
  {
    id: 3,
    name: "Bali Temple Hopping",
    location: "Bali, Indonesia",
    type: "Cultural",
    duration: "6 hours", 
    price: 65,
    rating: 4.8,
    reviews: 456,
    description: "Visit ancient temples and learn about Balinese Hindu culture and traditions",
    image: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg",
    tags: ["Culture", "Spiritual", "History"]
  },
  {
    id: 4,
    name: "Central Park Bike Tour",
    location: "New York, USA",
    type: "Adventure",
    duration: "2.5 hours",
    price: 35,
    rating: 4.6,
    reviews: 789,
    description: "Cycle through NYC's most famous park and discover hidden spots",
    image: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg",
    tags: ["Outdoor", "Exercise", "Nature"]
  },
  {
    id: 5,
    name: "Santorini Sunset Cruise",
    location: "Santorini, Greece",
    type: "Adventure",
    duration: "4 hours",
    price: 120,
    rating: 4.9,
    reviews: 567,
    description: "Sail around the caldera and watch the famous Santorini sunset",
    image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
    tags: ["Sunset", "Boat", "Romance"]
  },
  {
    id: 6,
    name: "Dubai Desert Safari",
    location: "Dubai, UAE",
    type: "Adventure",
    duration: "6 hours",
    price: 95,
    rating: 4.5,
    reviews: 892,
    description: "Experience dune bashing, camel riding, and traditional Bedouin dinner",
    image: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg",
    tags: ["Desert", "Adventure", "Culture"]
  }
];

const activityTypes = ["All Types", "Food & Drink", "Sightseeing", "Cultural", "Adventure", "Entertainment", "Nature"];
const priceRanges = ["All Prices", "Under $50", "$50-$100", "$100-$200", "Over $200"];
const durations = ["All Durations", "Under 2 hours", "2-4 hours", "4-6 hours", "Full Day"];

export default function ActivitySearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedPrice, setSelectedPrice] = useState('All Prices');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [sortBy, setSortBy] = useState('rating');

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'All Types' || activity.type === selectedType;
    const matchesPrice = selectedPrice === 'All Prices' || 
      (selectedPrice === 'Under $50' && activity.price < 50) ||
      (selectedPrice === '$50-$100' && activity.price >= 50 && activity.price < 100) ||
      (selectedPrice === '$100-$200' && activity.price >= 100 && activity.price < 200) ||
      (selectedPrice === 'Over $200' && activity.price >= 200);
    
    return matchesSearch && matchesType && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration);
      case 'reviews':
        return b.reviews - a.reviews;
      default:
        return b.rating - a.rating;
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Food & Drink': return <Utensils className="w-4 h-4" />;
      case 'Sightseeing': return <Camera className="w-4 h-4" />;
      case 'Cultural': return <Building className="w-4 h-4" />;
      case 'Adventure': return <Mountain className="w-4 h-4" />;
      case 'Nature': return <TreePine className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Discover Activities</h1>
          <p className="text-gray-600">
            Find amazing experiences and activities for your next adventure
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search activities, locations, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    {getTypeIcon(selectedType)}
                    <span className="ml-2">{selectedType}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {activityTypes.map((type) => (
                    <DropdownMenuItem 
                      key={type}
                      onClick={() => setSelectedType(type)}
                    >
                      {getTypeIcon(type)}
                      <span className="ml-2">{type}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {selectedPrice}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {priceRanges.map((range) => (
                    <DropdownMenuItem 
                      key={range}
                      onClick={() => setSelectedPrice(range)}
                    >
                      {range}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Clock className="w-4 h-4 mr-2" />
                    Duration
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {durations.map((duration) => (
                    <DropdownMenuItem 
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                    >
                      {duration}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy('rating')}>
                    <Star className="w-4 h-4 mr-2" />
                    Rating
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-low')}>
                    Price (Low to High)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-high')}>
                    Price (High to Low)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('duration')}>
                    <Clock className="w-4 h-4 mr-2" />
                    Duration
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('reviews')}>
                    <Users className="w-4 h-4 mr-2" />
                    Most Reviewed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:bg-purple-200 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {selectedType !== 'All Types' && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700">
                Type: {selectedType}
                <button onClick={() => setSelectedType('All Types')} className="ml-1 hover:bg-purple-200 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {selectedPrice !== 'All Prices' && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-700">
                Price: {selectedPrice}
                <button onClick={() => setSelectedPrice('All Prices')} className="ml-1 hover:bg-purple-200 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
          </p>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group activity-card border-purple-200">
              <div className="relative h-48">
                <img 
                  src={activity.image} 
                  alt={activity.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity"></div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className="bg-purple-100 text-purple-800">
                    {activity.type}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 px-2 py-1 rounded-md flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                    <span className="text-xs font-medium">{activity.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity purple-gradient hover:from-purple-700 hover:to-violet-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                  {activity.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {activity.location}
                </p>
                
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {activity.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {activity.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-purple-200 text-purple-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{activity.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-gray-500 mr-3">{activity.reviews}</span>
                    <span className="font-semibold text-purple-600 text-lg">
                      ${activity.price}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-purple-900 mb-2">No activities found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All Types');
                setSelectedPrice('All Prices');
                setSelectedDuration('All Durations');
              }}
              className="purple-gradient hover:from-purple-700 hover:to-violet-700"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}