"use client";

import { useState, useEffect } from 'react';
import { MapPin, Calendar, DollarSign, Plus, Clock, ArrowLeft, Save, Edit3, Trash2 } from 'lucide-react';

type SelectedPlace = {
  name: string;
  budget: number;
};

type TripData = {
  place: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  totalBudget: number;
  sections?: TripSection[];
  totalPlannedDays?: number;
  totalSectionBudget?: number;
};

type TripSection = {
  id: string;
  place: string;
  budget: number;
  daysToStay: number;
  dateRange: string;
  isEditable: boolean;
};

export default function TripDetailsPage() {
  const [tripSections, setTripSections] = useState<TripSection[]>([]);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTripData = localStorage.getItem('completeTripData');
    const savedSelectedPlaces = localStorage.getItem('selectedPlaces');
    
    let parsedTripData: TripData | null = null;
    let parsedSelectedPlaces: SelectedPlace[] = [];

    try {
      if (savedTripData) {
        parsedTripData = JSON.parse(savedTripData);
      }
      if (savedSelectedPlaces) {
        parsedSelectedPlaces = JSON.parse(savedSelectedPlaces);
      }
    } catch (error) {
      console.error("Error parsing saved data:", error);
    }

    setTripData(parsedTripData);
    setTotalDays(parsedTripData?.numberOfDays || 0);

    const sections: TripSection[] = parsedSelectedPlaces.map((place, index) => ({
      id: `section-${index + 1}`,
      place: place.name,
      budget: place.budget,
      daysToStay: 1,
      dateRange: `Day ${index + 1}`,
      isEditable: false
    }));
    
    setTripSections(sections);
    setIsLoading(false);
  }, []);

  const handleDaysChange = (sectionId: string, days: number) => {
    setTripSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, daysToStay: Math.max(1, days) }
          : section
      )
    );
  };

  const handlePlaceChange = (sectionId: string, place: string) => {
    setTripSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, place: place }
          : section
      )
    );
  };

  const handleBudgetChange = (sectionId: string, budget: number) => {
    setTripSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, budget: Math.max(0, budget) }
          : section
      )
    );
  };

  const removeSection = (sectionId: string) => {
    setTripSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const addNewSection = () => {
    const newSection: TripSection = {
      id: `section-${Date.now()}`,
      place: '',
      budget: 0,
      daysToStay: 1,
      dateRange: `Day ${tripSections.length + 1}`,
      isEditable: true
    };
    setTripSections(prev => [...prev, newSection]);
  };

  const getTotalPlannedDays = (): number => {
    return tripSections.reduce((sum, section) => sum + section.daysToStay, 0);
  };

  const getTotalBudget = (): number => {
    return tripSections.reduce((sum, section) => sum + section.budget, 0);
  };

  const handleSavePlan = () => {
    if (!tripData) return;

    const updatedTripData: TripData = {
      ...tripData,
      sections: tripSections,
      totalPlannedDays: getTotalPlannedDays(),
      totalSectionBudget: getTotalBudget()
    };

    localStorage.setItem('detailedTripPlan', JSON.stringify(updatedTripData));
    
    console.log('Detailed Trip Plan Saved:', updatedTripData);
    alert('Trip plan saved successfully!');
  };

  const handleGoBack = () => {
    alert('In your actual app, this would navigate back to the previous page');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading trip details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleGoBack}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">GlobalTrotter</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {totalDays} days total
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ${getTotalBudget()} USD
            </span>
          </div>
        </div>

        {/* Trip Overview */}
        {tripData && (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Trip to {tripData.place}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div>
                <span className="text-gray-400">Duration:</span> {tripData.numberOfDays} days
              </div>
              <div>
                <span className="text-gray-400">Planned Days:</span> {getTotalPlannedDays()} days
              </div>
              <div>
                <span className="text-gray-400">Dates:</span> {tripData.startDate} to {tripData.endDate}
              </div>
            </div>
          </div>
        )}

        {/* Trip Sections */}
        <div className="space-y-6">
          {tripSections.map((section, index) => (
            <div 
              key={section.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Section {index + 1}:
                  {section.isEditable && (
                    <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                      Custom
                    </span>
                  )}
                </h3>
                {section.isEditable && (
                  <button
                    onClick={() => removeSection(section.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Place Name */}
                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm font-medium">
                    Place/Activity
                  </label>
                  {section.isEditable ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={section.place}
                        onChange={(e) => handlePlaceChange(section.id, e.target.value)}
                        className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-colors"
                        placeholder="Enter place or activity name"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {section.place}
                    </div>
                  )}
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm font-medium">
                    Budget of this section
                  </label>
                  {section.isEditable ? (
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        value={section.budget}
                        onChange={(e) => handleBudgetChange(section.id, parseInt(e.target.value) || 0)}
                        className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 focus:outline-none transition-colors"
                        placeholder="Enter budget amount"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      ${section.budget} USD
                    </div>
                  )}
                </div>

                {/* Days to Stay */}
                <div className="space-y-2">
                  <label className="block text-gray-400 text-sm font-medium">
                    Days to stay
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      value={section.daysToStay}
                      onChange={(e) => handleDaysChange(section.id, parseInt(e.target.value) || 1)}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-colors"
                      placeholder="Enter days"
                    />
                  </div>
                </div>
              </div>

              {/* Date Range Display */}
              <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>Duration: {section.daysToStay} {section.daysToStay === 1 ? 'day' : 'days'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Section Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={addNewSection}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 rounded-lg text-white font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add another Section
          </button>
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Trip Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{tripSections.length}</div>
              <div className="text-gray-400">Total Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{getTotalPlannedDays()}</div>
              <div className="text-gray-400">Planned Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">${getTotalBudget()}</div>
              <div className="text-gray-400">Total Budget</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleSavePlan}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Save className="w-5 h-5" />
            Save Trip Plan
          </button>
        </div>
      </div>
    </div>
  );
}