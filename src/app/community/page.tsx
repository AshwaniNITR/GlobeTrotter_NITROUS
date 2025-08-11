"use client";

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  Eye
} from 'lucide-react';

const communityPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      avatar: "SC",
      location: "San Francisco, CA"
    },
    trip: {
      title: "2 Weeks in Japan: Cherry Blossom Season",
      destination: "Tokyo, Kyoto, Osaka",
      duration: "14 days",
      budget: 3200,
      image: "https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg"
    },
    content: "Just returned from an incredible 2-week journey through Japan during cherry blossom season! The temples in Kyoto were absolutely breathtaking, and the food scene in Osaka exceeded all expectations. Happy to share my detailed itinerary with anyone planning a similar trip!",
    stats: {
      likes: 234,
      comments: 45,
      shares: 12,
      views: 1200
    },
    tags: ["Japan", "Cherry Blossoms", "Culture", "Food"],
    postedAt: "2 days ago",
    featured: true
  },
  {
    id: 2,
    author: {
      name: "Mike Rodriguez",
      avatar: "MR",
      location: "Austin, TX"
    },
    trip: {
      title: "Budget Backpacking Through Southeast Asia",
      destination: "Thailand, Vietnam, Cambodia",
      duration: "30 days",
      budget: 1800,
      image: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg"
    },
    content: "Completed my month-long backpacking adventure through Southeast Asia on a tight budget! Managed to keep costs under $60/day including accommodation, food, and activities. The temples of Angkor Wat were the absolute highlight. Here's my complete budget breakdown and route.",
    stats: {
      likes: 189,
      comments: 67,
      shares: 23,
      views: 890
    },
    tags: ["Budget Travel", "Backpacking", "Southeast Asia", "Temples"],
    postedAt: "5 days ago"
  },
  {
    id: 3,
    author: {
      name: "Emma Thompson",
      avatar: "ET",
      location: "London, UK"
    },
    trip: {
      title: "Romantic Getaway to Santorini",
      destination: "Santorini, Greece",
      duration: "7 days",
      budget: 2800,
      image: "https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg"
    },
    content: "Celebrated our 5th anniversary with a magical week in Santorini. The sunsets from Oia are truly as spectacular as everyone says! We stayed in a cave hotel with a private pool - absolutely worth the splurge. Perfect for couples looking for a romantic escape.",
    stats: {
      likes: 156,
      comments: 28,
      shares: 8,
      views: 654
    },
    tags: ["Romance", "Greece", "Luxury", "Anniversary"],
    postedAt: "1 week ago"
  },
  {
    id: 4,
    author: {
      name: "David Kim",
      avatar: "DK",
      location: "Vancouver, BC"
    },
    trip: {
      title: "Solo Adventure in New Zealand",
      destination: "North & South Island, NZ",
      duration: "21 days",
      budget: 4500,
      image: "https://images.pexels.com/photos/1006293/pexels-photo-1006293.jpeg"
    },
    content: "Just finished an epic 3-week solo road trip across both islands of New Zealand. From the glowworm caves to the stunning fjords of Milford Sound, every day brought new adventures. The hiking trails are world-class and the locals are incredibly friendly!",
    stats: {
      likes: 298,
      comments: 52,
      shares: 19,
      views: 1456
    },
    tags: ["Solo Travel", "Adventure", "New Zealand", "Hiking"],
    postedAt: "3 days ago"
  }
];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredPosts = communityPosts.filter(post => {
    const matchesSearch = post.trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      post.tags.some(tag => tag.toLowerCase().includes(selectedFilter.toLowerCase()));
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.stats.likes - a.stats.likes;
      case 'discussed':
        return b.stats.comments - a.stats.comments;
      case 'recent':
      default:
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Travel Community</h1>
          <p className="text-gray-600">
            Discover amazing travel experiences shared by fellow adventurers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search trips, destinations, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedFilter('all')}>
                    All Posts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('budget')}>
                    Budget Travel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('luxury')}>
                    Luxury Travel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('solo')}>
                    Solo Travel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('adventure')}>
                    Adventure
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('culture')}>
                    Cultural
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy('recent')}>
                    Most Recent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('popular')}>
                    Most Popular
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('discussed')}>
                    Most Discussed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="purple-gradient hover:from-purple-700 hover:to-violet-700">
                Share Your Trip
              </Button>
            </div>
          </div>
        </div>

        {/* Community Posts */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className={`border-purple-200 hover:shadow-lg transition-all duration-300 ${post.featured ? 'ring-2 ring-purple-200' : ''}`}>
              {post.featured && (
                <div className="bg-purple-100 px-4 py-2 border-b border-purple-200">
                  <div className="flex items-center text-purple-700">
                    <Star className="w-4 h-4 mr-2 fill-current" />
                    <span className="text-sm font-medium">Featured Trip</span>
                  </div>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Author Avatar */}
                  <Avatar className="w-12 h-12 border-2 border-purple-200">
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
                      {post.author.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    {/* Author Info */}
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-purple-900">{post.author.name}</h3>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{post.postedAt}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {post.author.location}
                      </span>
                    </div>
                    
                    {/* Trip Title */}
                    <h2 className="text-xl font-bold text-purple-900 mb-3">{post.trip.title}</h2>
                    
                    {/* Trip Details */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {post.trip.destination}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.trip.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${post.trip.budget.toLocaleString()}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-purple-200 text-purple-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-purple-100">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
                          <Heart className="w-5 h-5" />
                          <span className="text-sm">{post.stats.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm">{post.stats.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm">{post.stats.shares}</span>
                        </button>
                        <div className="flex items-center space-x-2 text-gray-500">
                          <Eye className="w-5 h-5" />
                          <span className="text-sm">{post.stats.views}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="purple-gradient hover:from-purple-700 hover:to-violet-700">
                          View Itinerary
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-purple-900 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="purple-gradient hover:from-purple-700 hover:to-violet-700"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              Load More Posts
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}