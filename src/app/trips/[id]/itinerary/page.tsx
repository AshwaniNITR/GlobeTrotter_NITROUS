"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
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
  Search,
  Filter,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  Edit,
  Trash2,
  ArrowDown,
  GripVertical
} from 'lucide-react';

const sampleItinerary = {
  tripName: "Tokyo Adventure",
  destination: "Tokyo, Japan",
  days: [
    {
      day: 1,
      date: "March 15, 2024",
      activities: [
        {
          id: 1,
          name: "Arrive at Narita Airport",
          type: "Transport",
          time: "10:00 AM",
          duration: "2 hours",
          cost: 45,
          description: "Airport transfer to hotel in Shibuya"
        },
        {
          id: 2,
          name: "Check-in at Hotel",
          type: "Accommodation",
          time: "12:30 PM",
          duration: "30 mins",
          cost: 0,
          description: "Hotel check-in and room setup"
        },
        {
          id: 3,
          name: "Shibuya Crossing Experience",
          type: "Sightseeing",
          time: "2:00 PM",
          duration: "1.5 hours",
          cost: 0,
          description: "Experience the world's busiest pedestrian crossing"
        },
        {
          id: 4,
          name: "Traditional Ramen Dinner",
          type: "Food",
          time: "7:00 PM",
          duration: "1 hour",
          cost: 25,
          description: "Authentic ramen at local restaurant"
        }
      ]
    },
    {
      day: 2,
      date: "March 16, 2024",
      activities: [
        {
          id: 5,
          name: "Senso-ji Temple Visit",
          type: "Cultural",
          time: "9:00 AM",
          duration: "2 hours",
          cost: 0,
          description: "Explore Tokyo's oldest temple in Asakusa"
        },
        {
          id: 6,
          name: "Tokyo Skytree",
          type: "Sightseeing",
          time: "12:00 PM",
          duration: "2 hours",
          cost: 35,
          description: "Panoramic views from Tokyo's tallest tower"
        },
        {
          id: 7,
          name: "Sushi Making Class",
          type: "Activity",
          time: "4:00 PM",
          duration: "3 hours",
          cost: 85,
          description: "Learn to make authentic sushi with a master chef"
        }
      ]
    }
  ]
};

export default function ItineraryPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('timeline'); // timeline or list

  const getActivityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'transport': return 'bg-blue-100 text-blue-800';
      case 'accommodation': return 'bg-green-100 text-green-800';
      case 'sightseeing': return 'bg-purple-100 text-purple-800';
      case 'food': return 'bg-orange-100 text-orange-800';
      case 'cultural': return 'bg-indigo-100 text-indigo-800';
      case 'activity': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalDayCost = (activities: any[]) => {
    return activities.reduce((total, activity) => total + activity.cost, 0);
  };

  const getTotalTripCost = () => {
    return sampleItinerary.days.reduce((total, day) => 
      total + getTotalDayCost(day.activities), 0
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-900 mb-2">
                Itinerary for {sampleItinerary.tripName}
              </h1>
              <p className="text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {sampleItinerary.destination}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-2xl font-bold text-purple-900">${getTotalTripCost()}</p>
              </div>
              <Button className="purple-gradient hover:from-purple-700 hover:to-violet-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Trip
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedFilter('all')}>
                    All Activities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('sightseeing')}>
                    Sightseeing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('food')}>
                    Food & Dining
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('cultural')}>
                    Cultural
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('activity')}>
                    Activities
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    View: {viewMode}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setViewMode('timeline')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Timeline View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode('list')}>
                    List View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="purple-gradient hover:from-purple-700 hover:to-violet-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </div>
          </div>
        </div>

        {/* Itinerary Content */}
        <div className="space-y-8">
          {sampleItinerary.days.map((day) => (
            <Card key={day.day} className="border-purple-200">
              <CardHeader className="bg-purple-50 border-b border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-purple-900 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Day {day.day}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{day.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Day Budget</p>
                    <p className="text-xl font-bold text-purple-900">
                      ${getTotalDayCost(day.activities)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {day.activities.map((activity, index) => (
                    <div key={activity.id}>
                      <div className="flex items-start space-x-4 p-4 rounded-lg border border-purple-100 hover:bg-purple-50 transition-colors group">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-6"></div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold text-purple-900">{activity.name}</h4>
                                <Badge className={getActivityTypeColor(activity.type)}>
                                  {activity.type}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-700 text-sm mb-2">{activity.description}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {activity.time}
                                </div>
                                <div className="flex items-center">
                                  <span>{activity.duration}</span>
                                </div>
                                {activity.cost > 0 && (
                                  <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    ${activity.cost}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                                <GripVertical className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 text-right">
                          {activity.cost > 0 && (
                            <div className="bg-purple-100 px-3 py-1 rounded-full">
                              <span className="text-purple-800 font-medium">${activity.cost}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {index < day.activities.length - 1 && (
                        <div className="flex justify-center py-2">
                          <ArrowDown className="w-4 h-4 text-purple-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-purple-200">
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity to Day {day.day}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Day */}
        <Card className="border-2 border-dashed border-purple-300 hover:border-purple-400 transition-colors">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-purple-900 mb-2">Add Another Day</h3>
            <p className="text-gray-600 mb-4">Extend your trip with more activities and experiences</p>
            <Button className="purple-gradient hover:from-purple-700 hover:to-violet-700">
              Add Day {sampleItinerary.days.length + 1}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}