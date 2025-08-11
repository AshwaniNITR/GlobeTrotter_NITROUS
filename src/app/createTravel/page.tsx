"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Compass, Star, Plane, ChevronDown, Check, Activity, DollarSign, Map, Loader } from 'lucide-react';

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
      
      //alert(`Trip plan created successfully!\n\nDestination: ${formData.place}\nDuration: ${numberOfDays} days\nPlaces: ${selectedPlaces.length}\nTotal Budget: ${totalBudget} USD\n\nIn your actual app, you would be redirected to the trip details page now.`);
      router.push('/tripPlanner')
    } catch (err) {
      console.error('Error creating trip:', err);
      setError('Failed to create trip. Please try again.');
    }
  };
  const router=useRouter();

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

            {/* Suggest Button */}
            <div className="flex justify-center mb-8">
              <button 
                onClick={handleSuggestClick}
                disabled={!formData.place.trim() || isLoading}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Star className="w-4 h-4" />
                )}
                {isLoading ? 'Getting Suggestions...' : 'Get Suggestions'}
              </button>
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

            {/* Trip Duration and Budget Summary */}
            {(numberOfDays > 0 || selectedPlaces.length > 0) && (
              <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">Trip Summary</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {numberOfDays > 0 && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-800 font-medium">
                        Duration: {numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                  )}
                  {selectedPlaces.length > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-800 font-medium">
                          Places: {selectedPlaces.length} selected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 font-medium">
                          Budget: ${totalBudget} USD
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Selected Places Details */}
            {selectedPlaces.length > 0 && (
              <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">
                    Selected Places ({selectedPlaces.length})
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPlaces.map((place, index) => (
                    <span
                      key={index}
                      className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                    >
                      {place.name} - ${place.budget}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-semibold text-slate-800">
                  Suggested Places to Visit
                </h3>
                {selectedPlaces.length > 0 && (
                  <span className="text-sm text-slate-600">
                    (Click to select/deselect)
                  </span>
                )}
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  // Loading skeleton
                  Array(6).fill(null).map((_, index) => (
                    <div key={index} className="h-64 bg-slate-100 border border-slate-200 rounded-lg animate-pulse">
                      <div className="h-32 bg-slate-200 rounded-t-lg"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
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
                        className={`bg-white border-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden relative ${
                          isSelected 
                            ? 'border-green-500 shadow-lg ring-2 ring-green-200' 
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-10 bg-green-500 rounded-full p-1">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}

                        <div className="h-32 overflow-hidden">
                          {place.image_url ? (
                            <img 
                              src={place.image_url} 
                              alt={place.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjFmNWY5Ii8+CjxwYXRoIGQ9Im0xNSA5LTYgNi02LTYiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                              <Map className="w-8 h-8 text-slate-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-1">
                            {place.name}
                          </h4>
                          
                          <div className="flex items-center gap-1 mb-3">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium text-sm">
                              ${place.budget} USD
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-xs text-slate-600 font-medium">Activities:</p>
                            <div className="flex flex-wrap gap-1">
                              {place.activities.slice(0, 2).map((activity, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                                >
                                  {activity}
                                </span>
                              ))}
                              {place.activities.length > 2 && (
                                <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                                  +{place.activities.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Select indicator overlay */}
                        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
                          isSelected ? 'opacity-10' : 'opacity-0'
                        } bg-green-500`} />
                      </div>
                    );
                  })
                ) : (
                  // Empty state
                  Array(6).fill(null).map((_, index) => (
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
                            Click Get Suggestions to see recommendations
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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