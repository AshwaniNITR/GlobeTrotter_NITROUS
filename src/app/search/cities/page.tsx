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
  DollarSign,
  Users,
  Star,
  Plus,
  TrendingUp
} from 'lucide-react';

const cities = [
  {
    id: 1,
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    costIndex: 180,
    popularity: 95,
    rating: 4.8,
    activities: 150,
    description: "A vibrant metropolis blending traditional culture with cutting-edge technology",
    image: "https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg",
    tags: ["Culture", "Food", "Technology", "Shopping"]
  },
  {
    id: 2,
    name: "Paris",
    country: "France",
    region: "Europe",
    costIndex: 165,
    popularity: 98,
    rating: 4.9,
    activities: 120,
    description: "The City of Light, famous for art, fashion, gastronomy and culture",
    image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg",
    tags: ["Art", "Romance", "History", "Food"]
  },
  {
    id: 3,
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    costIndex: 85,
    popularity: 92,
    rating: 4.7,
    activities: 95,
    description: "Tropical paradise with stunning beaches, temples, and rich culture",
    image: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg",
    tags: ["Beach", "Spirituality", "Nature", "Relaxation"]
  },
  {
    id: 4,
    name: "New York",
    country: "USA",
    region: "North America",
    costIndex: 220,
    popularity: 96,
    rating: 4.6,
    activities: 200,
    description: "The city that never sleeps, offering world-class entertainment and culture",
    image: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg",
    tags: ["Entertainment", "Business", "Culture", "Shopping"]
  },
  {
    id: 5,
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    costIndex: 150,
    popularity: 89,
    rating: 4.8,
    activities: 45,
    description: "Iconic Greek island with stunning sunsets and white-washed buildings",
    image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg",
    tags: ["Romance", "Beach", "Photography", "Wine"]
  },
  {
    id: 6,
    name: "Dubai",
    country: "UAE",
    region: "Middle East",
    costIndex: 200,
    popularity: 88,
    rating: 4.5,
    activities: 110,
    description: "Modern oasis with luxury shopping, ultramodern architecture and lively nightlife",
    image: "https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg",
    tags: ["Luxury", "Architecture", "Shopping", "Desert"]
  }
];

const regions = ["All Regions", "Asia", "Europe", "North America", "South America", "Africa", "Oceania", "Middle East"];

export default function CitySearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState('all');

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         city.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRegion = selectedRegion === 'All Regions' || city.region === selectedRegion;
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'budget' && city.costIndex < 100) ||
      (priceRange === 'mid' && city.costIndex >= 100 && city.costIndex < 180) ||
      (priceRange === 'luxury' && city.costIndex >= 180);
    
    return matchesSearch && matchesRegion && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'rating':
        return b.rating - a.rating;
      case 'cost-low':
        return a.costIndex - b.costIndex;
      case 'cost-high':
        return b.costIndex - a.costIndex;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return b.popularity - a.popularity;
    }
  });

  const getCostLevel = (costIndex: number) => {
    if (costIndex < 100) return { label: 'Budget', color: 'bg-green-100 text-green-800' };
    if (costIndex < 180) return { label: 'Mid-range', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Luxury', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Cities</h1>
          <p className="text-gray-600">
            Discover amazing destinations for your next adventure
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cities, countries, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedRegion}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {regions.map((region) => (
                    <DropdownMenuItem 
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                    >
                      {region}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Price Range
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPriceRange('all')}>
                    All Prices
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceRange('budget')}>
                    Budget (&lt; $100/day)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceRange('mid')}>
                    Mid-range ($100-$180/day)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceRange('luxury')}>
                    Luxury ($180+/day)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy('popularity')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Popularity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('rating')}>
                    <Star className="w-4 h-4 mr-2" />
                    Rating
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('cost-low')}>
                    Cost (Low to High)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('cost-high')}>
                    Cost (High to Low)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('name')}>
                    Name (A-Z)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {selectedRegion !== 'All Regions' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Region: {selectedRegion}
                <button onClick={() => setSelectedRegion('All Regions')} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {priceRange !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: {priceRange}
                <button onClick={() => setPriceRange('all')} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'} found
          </p>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => {
            const costLevel = getCostLevel(city.costIndex);
            
            return (
              <Card key={city.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group search-result">
                <div className="relative h-48">
                  <img 
                    src={city.image} 
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity"></div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={costLevel.color}>
                      {costLevel.label}
                    </Badge>
                    <Badge className="bg-white/90 text-gray-700">
                      <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                      {city.rating}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 px-2 py-1 rounded-md text-xs font-medium">
                      {city.popularity}% popular
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                      {city.name}
                    </h3>
                    <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {city.country}, {city.region}
                  </p>
                  
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {city.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {city.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {city.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{city.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>${city.costIndex}/day</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{city.activities} activities</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCities.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cities found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('All Regions');
                setPriceRange('all');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}