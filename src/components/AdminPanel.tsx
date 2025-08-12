"use client"
import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
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
      const trips = Array.isArray(data?.trips) ? data.trips : [];
      setTravelData(trips);
    } catch (err) {
      console.error('Error fetching data:', err);
      setTravelData([]);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!Array.isArray(travelData)) return {
      totalTrips: 0,
      totalBudget: 0,
      totalDays: 0,
      avgBudget: 0,
      avgDays: 0,
      uniqueDestinations: 0,
    };

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
      uniqueDestinations,
    };
  }, [travelData]);

  // Data processing remains the same
  const destinationData = useMemo<DestinationData[]>(() => {
    if (travelData.length === 0) return [];
    const destinations: Record<string, number> = {};
    travelData.forEach(trip => {
      destinations[trip.destination] = (destinations[trip.destination] || 0) + 1;
    });
    return Object.entries(destinations).map(([name, value]) => ({ name, value }));
  }, [travelData]);

  const budgetDaysData = useMemo<BudgetDaysData[]>(() => {
    return travelData.map((trip, index) => ({
      x: trip.totalDays,
      y: trip.totalBudget,
      destination: trip.destination,
      id: index,
    }));
  }, [travelData]);

  const timelineData = useMemo<TimelineData[]>(() => {
    if (travelData.length === 0) return [];
    return travelData
      .map(trip => ({
        date: new Date(trip.createdAt).toLocaleDateString(),
        budget: trip.totalBudget,
        days: trip.totalDays,
        destination: trip.destination,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [travelData]);

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
      trips: data.count,
    }));
  }, [travelData]);

  // Updated color palette with purple theme
  const COLORS = [
  '#C084FC', // Bright purple
  '#A855F7', // Electric purple
  '#8B5CF6', // Vivid violet
  '#D946EF', // Fuchsia
  '#EC4899', // Pink
  '#F472B6', // Hot pink
  '#F59E0B', // Amber
  '#FCD34D', // Yellow
  '#34D399', // Emerald
  '#2DD4BF'  // Teal
];

  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, color = "#FBBF24" }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20 transition-all hover:scale-[1.02] hover:shadow-xl">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-white/10 mr-4">
        <Icon className="h-6 w-6 text-amber-300" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-amber-200">{title}</h3>
        <p className="text-2xl font-bold text-amber-50">{value}</p>
        {subtitle && <p className="text-xs text-amber-100/80">{subtitle}</p>}
      </div>
    </div>
  </div>
);


const LoadingMessage = () => (
  <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-12 text-center">
    <div className="text-amber-200 mb-4">
      <Clock className="h-16 w-16 mx-auto mb-4 animate-pulse text-amber-300" />
      <h3 className="text-xl font-semibold text-amber-50">Loading Travel Data</h3>
      <p className="text-amber-100/80 mt-2">Please wait while we fetch your travel information</p>
    </div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-12 text-center">
    <div className="text-amber-200 mb-4">
      <MapPin className="h-16 w-16 mx-auto mb-4 text-amber-300" />
      <h3 className="text-xl font-semibold text-amber-50">Error Loading Data</h3>
      <p className="text-amber-100/80 mt-2">{message}</p>
      <button
        onClick={fetchData}
        className="mt-4 px-4 py-2 bg-amber-400/10 text-amber-300 rounded-lg hover:bg-amber-400/20 transition-colors border border-amber-400/20"
      >
        Retry
      </button>
    </div>
  </div>
);

const NoDataMessage = () => (
  <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-12 text-center">
    <div className="text-amber-200 mb-4">
      <MapPin className="h-16 w-16 mx-auto mb-4 text-amber-300" />
      <h3 className="text-xl font-semibold text-amber-50">No Travel Data Available</h3>
      <p className="text-amber-100/80 mt-2">Start by adding some travel data to see analytics</p>
    </div>
  </div>
)

  if (isLoading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg mb-6 border border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-6 gap-4">
            <h1 className="text-3xl font-bold text-white">Travel Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-white/60">Last updated: {new Date().toLocaleString()}</div>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg mb-6 border border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'destinations', label: 'Destinations' },
              { key: 'budget', label: 'Budget Analysis' },
              { key: 'timeline', label: 'Timeline' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.key
                    ? 'border-purple-300 text-white'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {travelData.length === 0 ? (
          <NoDataMessage />
        ) : (
          <>
            {selectedTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard icon={MapPin} title="Total Trips" value={stats.totalTrips} color="#9F7AEA" />
                  <StatCard
                    icon={DollarSign}
                    title="Total Budget"
                    value={`₹${stats.totalBudget}`}
                    subtitle={`Avg: ₹${stats.avgBudget}/trip`}
                    color="#667EEA"
                  />
                  <StatCard
                    icon={Calendar}
                    title="Total Days"
                    value={stats.totalDays}
                    subtitle={`Avg: ${stats.avgDays} days/trip`}
                    color="#764BA2"
                  />
                </div>

                {/* Quick Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-white">Budget vs Trip Duration</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart
                        data={budgetDaysData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                        <XAxis dataKey="x" name="Days" stroke="#ffffff80" />
                        <YAxis dataKey="y" name="Budget" stroke="#ffffff80" />
                        <Tooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            borderColor: '#ffffff20',
                            borderRadius: '0.5rem',
                            color: 'white',
                          }}
                          formatter={(value: number, name: string) => [
                            value,
                            name === 'y' ? 'Budget (₹)' : 'Days',
                          ]}
                        />
                        <Scatter name="Trips" data={budgetDaysData} fill="#9F7AEA" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-white">Trips by Destination</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={destinationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} (${(percent! * 100).toFixed(0)}%)`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {destinationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            borderColor: '#ffffff20',
                            borderRadius: '0.5rem',
                            color: 'white',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'destinations' && (
              <div className="space-y-6">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-6 text-white">Destination Analysis</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={destinationBudgetData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                      <XAxis dataKey="destination" stroke="#ffffff80" />
                      <YAxis stroke="#ffffff80" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          borderColor: '#ffffff20',
                          borderRadius: '0.5rem',
                          color: 'white',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="avgBudget" fill="#9F7AEA" name="Avg Budget (₹)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="avgDays" fill="#667EEA" name="Avg Days" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-white">Total Budget by Destination</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={destinationBudgetData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                        <XAxis type="number" stroke="#ffffff80" />
                        <YAxis dataKey="destination" type="category" width={80} stroke="#ffffff80" />
                        <Tooltip
                          formatter={(value: number) => [`₹${value}`, 'Total Budget']}
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            borderColor: '#ffffff20',
                            borderRadius: '0.5rem',
                            color: 'white',
                          }}
                        />
                        <Bar dataKey="totalBudget" fill="#9F7AEA" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-white">Trip Count by Destination</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={destinationBudgetData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                        <XAxis dataKey="destination" stroke="#ffffff80" />
                        <YAxis stroke="#ffffff80" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            borderColor: '#ffffff20',
                            borderRadius: '0.5rem',
                            color: 'white',
                          }}
                        />
                        <Bar dataKey="trips" fill="#667EEA" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'budget' && (
              <div className="space-y-6">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-6 text-white">Budget Timeline</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                      <XAxis dataKey="date" stroke="#ffffff80" />
                      <YAxis stroke="#ffffff80" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          borderColor: '#ffffff20',
                          borderRadius: '0.5rem',
                          color: 'white',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="budget"
                        stroke="#9F7AEA"
                        name="Budget (₹)"
                        strokeWidth={2}
                        dot={{ fill: '#9F7AEA', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#ffffff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10">
                    <h4 className="font-semibold text-white/80 mb-2">Highest Budget</h4>
                    <p className="text-2xl font-bold text-white">
                      ₹{travelData.length > 0 ? Math.max(...travelData.map(t => t.totalBudget)) : 0}
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10">
                    <h4 className="font-semibold text-white/80 mb-2">Lowest Budget</h4>
                    <p className="text-2xl font-bold text-white">
                      ₹{travelData.length > 0 ? Math.min(...travelData.map(t => t.totalBudget)) : 0}
                    </p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10">
                    <h4 className="font-semibold text-white/80 mb-2">Budget Range</h4>
                    <p className="text-2xl font-bold text-white">
                      ₹
                      {travelData.length > 0
                        ? Math.max(...travelData.map(t => t.totalBudget)) -
                          Math.min(...travelData.map(t => t.totalBudget))
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'timeline' && (
              <div className="space-y-6">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold mb-6 text-white">Trip Creation Timeline</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                      <XAxis dataKey="date" stroke="#ffffff80" />
                      <YAxis stroke="#ffffff80" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          borderColor: '#ffffff20',
                          borderRadius: '0.5rem',
                          color: 'white',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="days"
                        stroke="#667EEA"
                        name="Trip Duration (Days)"
                        strokeWidth={2}
                        dot={{ fill: '#667EEA', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#ffffff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/10">
                  <div className="px-6 py-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">Trip Details</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead className="bg-white/10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                            Destination
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                            Start Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                            Duration
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                            Budget
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                            Sections
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                            User
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {travelData.map(trip => (
                          <tr key={trip._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{trip.destination}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                              {new Date(trip.startDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{trip.totalDays} days</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">₹{trip.totalBudget}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                              {Array.isArray(trip.sections) ? trip.sections.length : trip.sections}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 truncate" title={trip.userEmail}>
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