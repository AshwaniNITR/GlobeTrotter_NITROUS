"use client";

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Compass, Star, Plane, ChevronDown, Check, Activity,  Map, Loader, X, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TripPlannerPage() {
  type FormData = {
    startDate: string;
    place: string;
    endDate: string;
    activities: string[];
  };

  type PlaceData = {
    name: string;
    budget: number;
    activities: string[];
    image_url: string;
  };

  type SelectedPlace = {
    name: string;
    budget: number;
  };

  const [formData, setFormData] = useState<FormData>({
    startDate: '',
    place: '',
    endDate: '',
    activities: []
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestedPlaces, setSuggestedPlaces] = useState<PlaceData[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [numberOfDays, setNumberOfDays] = useState<number>(0);
  const router=useRouter();

  const activityOptions = [
    'Hiking & Trekking',
    'Paragliding',
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

    // Store dates in localStorage and calculate days
    if (field === 'startDate' || field === 'endDate') {
      const updatedData = { ...formData, [field]: value };
      
      // Store dates in localStorage (in actual app, uncomment these lines)
      localStorage.setItem('tripStartDate', updatedData.startDate);
      localStorage.setItem('tripEndDate', updatedData.endDate);
      
      // Calculate number of days
      if (updatedData.startDate && updatedData.endDate) {
        const startDate = new Date(updatedData.startDate);
        const endDate = new Date(updatedData.endDate);
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
        
        if (daysDiff > 0) {
          setNumberOfDays(daysDiff);
          // Store number of days in localStorage (in actual app, uncomment this line)
          localStorage.setItem('tripDays', daysDiff.toString());
        } else {
          setNumberOfDays(0);
          localStorage.setItem('tripDays', '0');
        }
      }
    }
  };

  const handleActivityToggle = (activity: string): void => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a: string) => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  // Handle place selection/deselection
  const handlePlaceSelection = (place: PlaceData) => {
    const selectedPlace: SelectedPlace = {
      name: place.name,
      budget: place.budget
    };

    setSelectedPlaces(prev => {
      const isAlreadySelected = prev.some(p => p.name === place.name);
      
      if (isAlreadySelected) {
        // Remove from selection
        const updated = prev.filter(p => p.name !== place.name);
        // In your actual app, replace this with localStorage
        localStorage.setItem('selectedPlaces', JSON.stringify(updated));
        return updated;
      } else {
        // Add to selection
        const updated = [...prev, selectedPlace];
        // In your actual app, replace this with localStorage
        localStorage.setItem('selectedPlaces', JSON.stringify(updated));
        return updated;
      }
    });
  };

  // Check if a place is selected
  const isPlaceSelected = (placeName: string): boolean => {
    return selectedPlaces.some(p => p.name === placeName);
  };

  // Calculate total budget
  const totalBudget = selectedPlaces.reduce((sum, place) => sum + place.budget, 0);

  // Load data from localStorage on component mount (in actual app, uncomment this)
  useEffect(() => {
    const savedStartDate = localStorage.getItem('tripStartDate');
    const savedEndDate = localStorage.getItem('tripEndDate');
    const savedDays = localStorage.getItem('tripDays');
    const savedPlaces = localStorage.getItem('selectedPlaces');
    
    if (savedStartDate && savedEndDate) {
      setFormData(prev => ({
        ...prev,
        startDate: savedStartDate,
        endDate: savedEndDate
      }));
    }
    
    if (savedDays) {
      setNumberOfDays(parseInt(savedDays));
    }
    
    if (savedPlaces) {
      setSelectedPlaces(JSON.parse(savedPlaces));
    }
  }, []);

  const fetchSuggestions = async () => {
    if (!formData.place.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://odoo-api-ethrh5dbhmfvd9gw.canadacentral-01.azurewebsites.net/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: formData.place,
          activities: formData.activities
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestedPlaces(data);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Failed to fetch suggestions. Please try again.');
      // For demo purposes, using sample data when API fails
      setSuggestedPlaces([
        {
          name: "Fushimi Inari Taisha",
          budget: 20,
          activities: ["temple visits", "hiking"],
          image_url: "https://dskyoto.s3.amazonaws.com/gallery/full/8514/5559/7797/08-20131216_FushimiInari_Mainspot-307.jpg"
        },
        {
          name: "Kinkaku-ji (Golden Pavilion)",
          budget: 30,
          activities: ["temple visits"],
          image_url: "https://www.japan-guide.com/g18/3908_top.jpg"
        },
        {
          name: "Arashiyama Bamboo Grove",
          budget: 15,
          activities: ["hiking"],
          image_url: "https://photos.smugmug.com/i-hFcX6RC/0/1c58ee68/L/famous-bamboo-grove-arashiyama-L.jpg"
        },
        {
          name: "Nijo Castle",
          budget: 25,
          activities: ["temple visits"],
          image_url: "https://upload.wikimedia.org/wikipedia/commons/d/dd/NinomaruPalace.jpg"
        },
        {
          name: "Kyoto Food Tour",
          budget: 100,
          activities: ["food tours"],
          image_url: "https://res.cloudinary.com/dbm1qiew0/image/upload/q_auto,f_auto,dpr_2.0,h_500/v1699861033/products/ff345d77-8741-4669-aef1-e0d979c2361f/images/19cf1d3d-7f53-49b1-8a51-ee393cae1071.jpg"
        },
        {
          name: "Philosopher's Path",
          budget: 10,
          activities: ["hiking"],
          image_url: "https://www.japan-guide.com/g18/3906_top.jpg"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestClick = () => {
    if (!formData.place.trim()) {
      setError('Please enter a destination first');
      return;
    }
    fetchSuggestions();
  };

  const handleCreateTrip = async () => {
    // Validate required fields
    if (!formData.startDate || !formData.endDate || !formData.place) {
      setError('Please fill in all required fields (Start Date, End Date, and Place)');
      return;
    }

    if (selectedPlaces.length === 0) {
      setError('Please select at least one place to visit');
      return;
    }

    const tripData = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      numberOfDays: numberOfDays,
      place: formData.place,
      activities: formData.activities,
      suggestedPlaces: suggestedPlaces,
      selectedPlaces: selectedPlaces,
      totalBudget: totalBudget,
      createdAt: new Date().toISOString()
    };
    
    try {
      // Store all data in localStorage (in actual app, uncomment these lines)
      localStorage.setItem('completeTripData', JSON.stringify(tripData));
      localStorage.setItem('tripStartDate', formData.startDate);
      localStorage.setItem('tripEndDate', formData.endDate);
      localStorage.setItem('tripPlace', formData.place);
      localStorage.setItem('tripActivities', JSON.stringify(formData.activities));
      localStorage.setItem('selectedPlaces', JSON.stringify(selectedPlaces));
      localStorage.setItem('tripDays', numberOfDays.toString());
      localStorage.setItem('totalBudget', totalBudget.toString());
      
      console.log('Trip Data Stored:', tripData);
      console.log('Selected Places:', selectedPlaces);
      console.log('Trip Duration:', numberOfDays, 'days');
      console.log('Total Budget:', totalBudget, 'USD');
      
      // In your actual app, replace this alert with navigation:
      // window.location.href = '/trip-details'; // or use your router
      // For Next.js: router.push('/trip-details');
      // For React Router: navigate('/trip-details');
      // For demo purposes, just alerting the trip creation
      router.push('/tripPlanner')
    } catch (err) {
      console.error('Error creating trip:', err);
      setError('Failed to create trip. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg flex items-center justify-center">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                GlobalTrotter
              </h1>
              <p className="text-sm text-gray-500 font-medium">Plan Your Perfect Journey</p>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            Create Your Dream Trip
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Discover amazing destinations and create unforgettable memories with our intelligent trip planner
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-lg border border-purple-100 shadow-2xl rounded-3xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 border-b border-purple-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Plan Your Adventure</h3>
                  <p className="text-gray-600 text-sm">Fill in the details to get personalized recommendations</p>
                </div>
              </div>
              
              {/* Get Suggestions Button */}
              <button 
                onClick={handleSuggestClick}
                disabled={!formData.place.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Star className="w-5 h-5" />
                )}
                {isLoading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
              </button>
            </div>
          </div>
          
          {/* Card Content */}
          <div className="p-6 sm:p-8">
            {/* Trip Planning Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <label htmlFor="startDate" className="block text-gray-700 font-semibold text-sm">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      handleInputChange('startDate', e.target.value);
                      if (formData.endDate && e.target.value > formData.endDate) {
                        setFormData(prev => ({ ...prev, endDate: "" }));
                      }
                    }}
                    className="w-full pl-12 pr-4 py-4 text-gray-800 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 focus:outline-none transition-all duration-200 text-base"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="endDate" className="block text-gray-700 font-semibold text-sm">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    min={formData.startDate || new Date().toISOString().split("T")[0]}
                    disabled={!formData.startDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-800 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 focus:outline-none transition-all duration-200 text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="place" className="block text-gray-700 font-semibold text-sm">
                  Destination *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    id="place"
                    type="text"
                    placeholder="Where do you want to go?"
                    value={formData.place}
                    onChange={(e) => handleInputChange('place', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-800 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 focus:outline-none transition-all duration-200 text-base placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-gray-700 font-semibold text-sm">
                  Activities & Interests
                </label>
                <div className="relative">
                  <Activity className="absolute left-4 top-4 w-5 h-5 text-purple-400 z-10" />
                  <div
                    className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 cursor-pointer transition-all duration-200 min-h-[56px] flex items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="flex-1">
                      {formData.activities.length === 0 ? (
                        <span className="text-gray-400 text-base">Select your interests...</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {formData.activities.slice(0, 2).map((activity) => (
                            <span
                              key={activity}
                              className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium"
                            >
                              {activity}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleActivityToggle(activity);
                                }}
                                className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {formData.activities.length > 2 && (
                            <span className="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-medium">
                              +{formData.activities.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={`absolute right-4 top-4 w-5 h-5 text-purple-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-purple-100 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                      <div className="p-2">
                        {activityOptions.map((activity) => (
                          <div
                            key={activity}
                            className="flex items-center px-4 py-3 hover:bg-purple-50 cursor-pointer rounded-lg transition-colors"
                            onClick={() => handleActivityToggle(activity)}
                          >
                            <div className={`w-5 h-5 border-2 border-purple-300 rounded-md flex items-center justify-center mr-3 transition-all ${formData.activities.includes(activity) ? 'bg-purple-600 border-purple-600' : ''}`}>
                              {formData.activities.includes(activity) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-gray-700 text-sm font-medium">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trip Duration and Budget Summary */}
            {(numberOfDays > 0 || selectedPlaces.length > 0) && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-800">Trip Overview</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {numberOfDays > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-blue-800 font-bold text-lg">
                          {numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'}
                        </p>
                        <p className="text-blue-600 text-sm">Duration</p>
                      </div>
                    </div>
                  )}
                  {selectedPlaces.length > 0 && (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-purple-800 font-bold text-lg">
                            {selectedPlaces.length} Places
                          </p>
                          <p className="text-purple-600 text-sm">Selected</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                        {/* <DollarSign className="w-5 h-5 text-green-600" /> */}
                        <div>
                          <p className="text-green-800 font-bold text-lg">
                            ${totalBudget}
                          </p>
                          <p className="text-green-600 text-sm">Total Budget</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Selected Places Details */}
            {selectedPlaces.length > 0 && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-green-800">
                    Selected Destinations ({selectedPlaces.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedPlaces.map((place, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 bg-white/80 text-green-800 text-sm px-4 py-2 rounded-xl font-medium shadow-sm border border-green-200"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{place.name}</span>
                      <span className="text-green-600 font-bold">${place.budget}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Suggestions Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Discover Amazing Places
                    </h3>
                    <p className="text-gray-600 text-sm">Click on places to add them to your trip</p>
                  </div>
                </div>
                {selectedPlaces.length > 0 && (
                  <div className="text-sm text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded-full">
                    {selectedPlaces.length} selected
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  // Loading skeleton
                  Array(6).fill(null).map((_, index) => (
                    <div key={index} className="h-80 bg-gray-100 border-2 border-gray-200 rounded-2xl animate-pulse overflow-hidden">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : suggestedPlaces.length > 0 ? (
                  suggestedPlaces.map((place, index) => {
                    const isSelected = isPlaceSelected(place.name);
                    return (
                      <div 
                        key={index}
                        onClick={() => handlePlaceSelection(place)}
                        className={`bg-white border-2 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden relative transform ${
                          isSelected 
                            ? 'border-green-400 shadow-xl ring-4 ring-green-200/50 scale-105' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 z-10 bg-green-500 rounded-full p-2 shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className="h-48 overflow-hidden relative">
                          {place.image_url ? (
                            <img 
                              src={place.image_url} 
                              alt={place.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjFmNWY5Ii8+CjxwYXRoIGQ9Im0xNSA5LTYgNi02LTYiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                              <Map className="w-12 h-12 text-purple-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        
                        <div className="p-5">
                          <h4 className="font-bold text-gray-800 text-lg mb-3 line-clamp-2">
                            {place.name}
                          </h4>
                          
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                              {/* <DollarSign className="w-4 h-4 text-green-600" /> */}
                              <span className="text-green-700 font-bold text-sm">
                                ${place.budget}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Activities</p>
                            <div className="flex flex-wrap gap-2">
                              {place.activities.slice(0, 2).map((activity, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium"
                                >
                                  {activity}
                                </span>
                              ))}
                              {place.activities.length > 2 && (
                                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                                  +{place.activities.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Selection overlay */}
                        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                          isSelected ? 'opacity-10' : 'opacity-0'
                        } bg-green-500 rounded-2xl`} />
                      </div>
                    );
                  })
                ) : (
                  // Empty state
                  Array(6).fill(null).map((_, index) => (
                    <div 
                      key={index}
                      className="h-80 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group flex items-center justify-center"
                    >
                      <div className="text-center p-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300 shadow-lg">
                          <Plane className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-purple-600 text-sm font-semibold mb-1">
                          Discover Amazing Places
                        </p>
                        <p className="text-gray-500 text-xs">
                          Click Get AI Suggestions to see recommendations
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center mt-12">
              <button 
                onClick={handleCreateTrip}
                disabled={!formData.startDate || !formData.endDate || !formData.place || selectedPlaces.length === 0}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 text-lg transform hover:scale-105 disabled:hover:scale-100"
              >
                <Plane className="w-6 h-6" />
                Create My Dream Trip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}