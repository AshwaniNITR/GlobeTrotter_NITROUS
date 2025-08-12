"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Calendar, DollarSign, MapPin, TrendingUp, Users, Clock } from 'lucide-react';

interface Trip {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalBudget: number;
  userEmail: string;
  sections: number[] | number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

interface DestinationData {
  name: string;
  value: number;
}

interface BudgetDaysData {
  x: number;
  y: number;
  destination: string;
  id: number;
}

interface TimelineData {
  date: string;
  budget: number;
  days: number;
  destination: string;
}

interface DestinationBudgetData {
  destination: string;
  avgBudget: number;
  totalBudget: number;
  avgDays: number;
  trips: number;
}

interface AdminPanelProps {
  initialData?: Trip[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ initialData = [] }) => {
  const [travelData, setTravelData] = useState<Trip[]>(Array.isArray(initialData) ? initialData : []);
  const [isLoading, setIsLoading] = useState(!initialData.length);
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialData.length) {
      fetchData();
    }
  }, []);

 const fetchData = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch('/api/getAllTrip');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    // Ensure we're working with an array
    const trips = Array.isArray(data?.trips) ? data.trips : [];
    setTravelData(trips);
  } catch (err) {
    console.error('Error fetching data:', err);
    setTravelData([]); // Reset to empty array on error
    setError(err instanceof Error ? err.message : 'An unknown error occurred');
  } finally {
    setIsLoading(false);
  }
};

  // Calculate statistics
 const stats = useMemo(() => {
  // Ensure travelData is an array before processing
  if (!Array.isArray(travelData)) {
    return {
      totalTrips: 0,
      totalBudget: 0,
      totalDays: 0,
      avgBudget: 0,
      avgDays: 0,
      uniqueDestinations: 0
    };
  }

  if (travelData.length === 0) {
    return {
      totalTrips: 0,
      totalBudget: 0,
      totalDays: 0,
      avgBudget: 0,
      avgDays: 0,
      uniqueDestinations: 0
    };
  }

  const totalTrips = travelData.length;
  const totalBudget = travelData.reduce((sum, trip) => sum + (trip.totalBudget || 0), 0);
  const totalDays = travelData.reduce((sum, trip) => sum + (trip.totalDays || 0), 0);
  const avgBudget = totalBudget / totalTrips;
  const avgDays = totalDays / totalTrips;
  const uniqueDestinations = [...new Set(travelData.map(trip => trip.destination))].length;

  return {
    totalTrips,
    totalBudget,
    totalDays,
    avgBudget: Math.round(avgBudget * 100) / 100,
    avgDays: Math.round(avgDays * 100) / 100,
    uniqueDestinations
  };
}, [travelData]);

  // Destination data for pie chart
  const destinationData = useMemo<DestinationData[]>(() => {
    if (travelData.length === 0) return [];
    
    const destinations: Record<string, number> = {};
    travelData.forEach(trip => {
      destinations[trip.destination] = (destinations[trip.destination] || 0) + 1;
    });
    return Object.entries(destinations).map(([name, value]) => ({ name, value }));
  }, [travelData]);

  // Budget vs Days scatter plot data
  const budgetDaysData = useMemo<BudgetDaysData[]>(() => {
    return travelData.map((trip, index) => ({
      x: trip.totalDays,
      y: trip.totalBudget,
      destination: trip.destination,
      id: index
    }));
  }, [travelData]);

  // Timeline data
  const timelineData = useMemo<TimelineData[]>(() => {
    if (travelData.length === 0) return [];
    
    return travelData.map(trip => ({
      date: new Date(trip.createdAt).toLocaleDateString(),
      budget: trip.totalBudget,
      days: trip.totalDays,
      destination: trip.destination
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [travelData]);

  // Destination budget analysis
  const destinationBudgetData = useMemo<DestinationBudgetData[]>(() => {
    if (travelData.length === 0) return [];
    
    const destBudgets: Record<string, { total: number; count: number; days: number }> = {};
    travelData.forEach(trip => {
      if (!destBudgets[trip.destination]) {
        destBudgets[trip.destination] = { total: 0, count: 0, days: 0 };
      }
      destBudgets[trip.destination].total += trip.totalBudget;
      destBudgets[trip.destination].count += 1;
      destBudgets[trip.destination].days += trip.totalDays;
    });

    return Object.entries(destBudgets).map(([destination, data]) => ({
      destination,
      avgBudget: Math.round((data.total / data.count) * 100) / 100,
      totalBudget: data.total,
      avgDays: Math.round((data.days / data.count) * 100) / 100,
      trips: data.count
    }));
  }, [travelData]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, color = "#3B82F6" }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center">
        <Icon className="h-12 w-12 mr-4"  />
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const LoadingMessage = () => (
    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
      <div className="text-gray-400 mb-4">
        <Clock className="h-16 w-16 mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-semibold text-gray-600">Loading Travel Data</h3>
        <p className="text-gray-500 mt-2">Please wait while we fetch your travel information</p>
      </div>
    </div>
  );

  const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
      <div className="text-red-400 mb-4">
        <MapPin className="h-16 w-16 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">Error Loading Data</h3>
        <p className="text-gray-500 mt-2">{message}</p>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const NoDataMessage = () => (
    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
      <div className="text-gray-400 mb-4">
        <MapPin className="h-16 w-16 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">No Travel Data Available</h3>
        <p className="text-gray-500 mt-2">Start by adding some travel data to see analytics</p>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Travel Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </div>
              <button 
                onClick={fetchData}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm hover:bg-blue-200"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'destinations', label: 'Destinations' },
              { key: 'budget', label: 'Budget Analysis' },
              { key: 'timeline', label: 'Timeline' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  selectedTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {travelData.length === 0 ? (
          <NoDataMessage />
        ) : (
          <>
            {selectedTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard
                    icon={MapPin}
                    title="Total Trips"
                    value={stats.totalTrips}
                    color="#3B82F6"
                  />
                  <StatCard
                    icon={DollarSign}
                    title="Total Budget"
                    value={`₹${stats.totalBudget}`}
                    subtitle={`Avg: ₹${stats.avgBudget}/trip`}
                    color="#10B981"
                  />
                  <StatCard
                    icon={Calendar}
                    title="Total Days"
                    value={stats.totalDays}
                    subtitle={`Avg: ${stats.avgDays} days/trip`}
                    color="#F59E0B"
                  />
                </div>

                {/* Quick Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Budget vs Trip Duration</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart data={budgetDaysData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" name="Days" />
                        <YAxis dataKey="y" name="Budget" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                                 formatter={(value: any, name: any) => [value, name === 'y' ? 'Budget (₹)' : 'Days']} />
                        <Scatter name="Trips" data={budgetDaysData} fill="#8884d8" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Trips by Destination</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={destinationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent! * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {destinationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'destinations' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6">Destination Analysis</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={destinationBudgetData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="destination" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgBudget" fill="#8884d8" name="Avg Budget (₹)" />
                      <Bar dataKey="avgDays" fill="#82ca9d" name="Avg Days" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Total Budget by Destination</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={destinationBudgetData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="destination" type="category" width={80} />
                        <Tooltip formatter={(value: any) => [`₹${value}`, 'Total Budget']} />
                        <Bar dataKey="totalBudget" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Trip Count by Destination</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={destinationBudgetData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="destination" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="trips" fill="#ff7300" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'budget' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6">Budget Timeline</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="budget" stroke="#8884d8" name="Budget (₹)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Highest Budget</h4>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{travelData.length > 0 ? Math.max(...travelData.map(t => t.totalBudget)) : 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Lowest Budget</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{travelData.length > 0 ? Math.min(...travelData.map(t => t.totalBudget)) : 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h4 className="font-semibold text-gray-700 mb-2">Budget Range</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{travelData.length > 0 ? 
                        Math.max(...travelData.map(t => t.totalBudget)) - 
                        Math.min(...travelData.map(t => t.totalBudget)) : 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'timeline' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6">Trip Creation Timeline</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="days" stroke="#82ca9d" name="Trip Duration (Days)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Trip Details</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sections</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {travelData.map((trip) => (
                          <tr key={trip._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trip.destination}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(trip.startDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.totalDays} days</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{trip.totalBudget}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {Array.isArray(trip.sections) ? trip.sections.length : trip.sections}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate" title={trip.userEmail}>
                              {trip.userEmail}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;