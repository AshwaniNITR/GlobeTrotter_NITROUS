"use client";

import { useState } from 'react';
import { MapPin, Calendar, Compass, Star, Plane, ChevronDown, Check, Activity } from 'lucide-react';

export default function TripPlannerPage() {
  type FormData = {
    startDate: string;
    place: string;
    endDate: string;
    activities: string[];
  };

  const [formData, setFormData] = useState<FormData>({
    startDate: '',
    place: '',
    endDate: '',
    activities: []
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activityOptions = [
    'Hiking & Trekking',
    'Museum Visits',
    'Beach Activities',
    'Local Food Tours',
    'Photography Tours',
    'Adventure Sports',
    'Cultural Experiences',
    'Shopping',
    'Nightlife',
    'Wildlife Safari',
    'Water Sports',
    'Historical Sites',
    'Art Galleries',
    'Live Music/Concerts',
    'Spa & Wellness',
    'City Walking Tours',
    'Mountain Climbing',
    'Scuba Diving',
    'Local Markets',
    'Religious Sites'
  ];


type FormField = keyof FormData;

const handleInputChange = (field: FormField, value: string) => {
    setFormData(prev => ({
        ...prev,
        [field]: value
    }));
};

interface ActivityToggleProps {
    activity: string;
}

const handleActivityToggle = (activity: string): void => {
    setFormData(prev => ({
        ...prev,
        activities: prev.activities.includes(activity)
            ? prev.activities.filter((a: string) => a !== activity)
            : [...prev.activities, activity]
    }));
};

  const handleCreateTrip = async () => {
    const tripData = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      place: formData.place,
      activities: formData.activities
    };
    
    console.log('Trip Data:', tripData);
    // TODO: Send to API when URL is provided
    // await fetch('API_URL_HERE', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ place: tripData.place, activities: tripData.activities })
    // });
  };

  const suggestionCards = Array(6).fill(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-slate-50 to-purple-100 relative">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Create a new Trip 
          </h1>
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <Compass className="w-5 h-5" />
            <span className="text-xl font-semibold">GlobalTrotter</span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-purple-100/50 to-slate-100/50 border-b border-slate-200/50 p-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-semibold text-slate-800">Plan a new trip</h2>
            </div>
            <p className="text-slate-600">Fill in the details to plan your perfect getaway</p>
          </div>
          
          {/* Card Content */}
          <div className="p-8">
            {/* Trip Planning Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-slate-700 font-medium text-sm">
                  Start Date:
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-black bg-slate-50/50 border border-slate-200 rounded-md focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="endDate" className="block text-slate-700 font-medium text-sm">
                  End Date:
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-black bg-slate-50/50 border border-slate-200 rounded-md focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="place" className="block text-slate-700 font-medium text-sm">
                  Select a Place:
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="place"
                    type="text"
                    placeholder="Enter destination"
                    value={formData.place}
                    onChange={(e) => handleInputChange('place', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-black bg-slate-50/50 border border-slate-200 rounded-md focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-medium text-sm">
                  Activities:
                </label>
                <div className="relative">
                  <Activity className="absolute left-3 top-3 w-4 h-4 text-slate-400 z-10" />
                  <div
                    className="w-full pl-10 pr-10 py-2 bg-slate-50/50 border border-slate-200 rounded-md focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 cursor-pointer transition-colors min-h-[40px] flex items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="flex-1">
                      {formData.activities.length === 0 ? (
                        <span className="text-slate-400">Select activities...</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {formData.activities.slice(0, 2).map((activity) => (
                            <span
                              key={activity}
                              className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                            >
                              {activity}
                            </span>
                          ))}
                          {formData.activities.length > 2 && (
                            <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                              +{formData.activities.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={`absolute right-3 top-3 w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                      {activityOptions.map((activity) => (
                        <div
                          key={activity}
                          className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer"
                          onClick={() => handleActivityToggle(activity)}
                        >
                          <div className={`w-4 h-4 border border-slate-300 rounded flex items-center justify-center mr-3 ${formData.activities.includes(activity) ? 'bg-purple-600 border-purple-600' : ''}`}>
                            {formData.activities.includes(activity) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-slate-700 text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Suggestions Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-semibold text-slate-800">
                  Suggestions for Places to Visit/Activities to perform
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestionCards.map((_, index) => (
                  <div 
                    key={index}
                    className="h-48 bg-gradient-to-br from-slate-50 to-purple-50/30 border border-slate-200/50 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                  >
                    <div className="h-full flex items-center justify-center p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-200 to-slate-200 flex items-center justify-center group-hover:from-purple-300 group-hover:to-slate-300 transition-all duration-300">
                          <Plane className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">
                          Suggestion {index + 1}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleCreateTrip}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <Plane className="w-5 h-5" />
                Create Trip Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}