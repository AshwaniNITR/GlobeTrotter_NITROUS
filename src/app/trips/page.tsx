"use client";

import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MapPin,
  Calendar,
  DollarSign,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const trips = [
  {
    id: 1,
    name: "Tokyo Adventure",
    destinations: ["Tokyo", "Osaka"],
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    days: 7,
    budget: 3500,
    status: "upcoming",
    activities: 12,
    image: "https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg"
  },
  {
    id: 2,
    name: "European Explorer",
    destinations: ["Paris", "London", "Rome"],
    startDate: "2024-04-10",
    endDate: "2024-04-20",
    days: 10,
    budget: 4200,
    status: "upcoming",
    activities: 18,
    image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg"
  },
  {
    id: 3,
    name: "Bali Getaway",
    destinations: ["Bali"],
    startDate: "2024-01-20",
    endDate: "2024-01-27",
    days: 7,
    budget: 2800,
    status: "ongoing",
    activities: 10,
    image: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg"
  },
  {
    id: 4,
    name: "New York City Break",
    destinations: ["New York"],
    startDate: "2023-12-15",
    endDate: "2023-12-20",
    days: 5,
    budget: 2200,
    status: "completed",
    activities: 8,
    image: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg"
  },
  {
    id: 5,
    name: "Mediterranean Cruise",
    destinations: ["Barcelona", "Rome", "Athens"],
    startDate: "2023-10-05",
    endDate: "2023-10-15",
    days: 10,
    budget: 3800,
    status: "completed",
    activities: 15,
    image: "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg"
  }
];

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.destinations.some(dest => dest.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
            <p className="text-gray-600">
              Manage your travel adventures and create new experiences
            </p>
          </div>
          <Link href="/trips/new">
            <Button className="mt-4 sm:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              New Trip
            </Button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Trips
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('ongoing')}>
                  Ongoing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('upcoming')}>
                  Upcoming
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline">
              Sort by Date
            </Button>
          </div>
        </div>

        {/* Trip Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <img 
                  src={trip.image} 
                  alt={trip.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity"></div>
                <div className="absolute top-3 left-3">
                  <Badge className={getStatusColor(trip.status)}>
                    {trip.status}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white/90">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <Link href={`/trips/${trip.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/trips/${trip.id}/edit`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Trip
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {trip.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{trip.destinations.join(', ')}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <span>{trip.days} days</span>
                    <span className="mx-2">•</span>
                    <span>{trip.activities} activities</span>
                  </div>
                  <div className="flex items-center font-semibold text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {trip.budget.toLocaleString()}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Link href={`/trips/${trip.id}`}>
                    <Button className="w-full" variant="outline">
                      View Trip
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrips.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start planning your first adventure!'
              }
            </p>
            <Link href="/trips/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Plan Your First Trip
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}