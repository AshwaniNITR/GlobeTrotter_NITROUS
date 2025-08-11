"use client";
import Image from 'next/image';
import { useState,useEffect } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';



export default  function DashboardPage() {

  const [profilePicture, setProfilePicture] = useState('');
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/fetch-all");
        const result = await response.json();
        if (result.success) {
          const userEmail = localStorage.getItem("userEmail") || "";
          const user = result.data.find((u: { email: string; profilePicture: string }) => u.email === userEmail);
          setProfilePicture(user?.profilePicture || "");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
    fetchProfile();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm border-b border-purple-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">GT</span>
            </div>
            <h1 className="text-xl font-bold text-purple-900">GlobalTrotter</h1>
          </div>
          
          <div className="flex items-center space-x-4">
           
            <div className="w-16 h-16 rounded-full overflow-hidden border border-purple-100">
              {profilePicture ? (
                <Image
                  src={profilePicture}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-purple-600">SR</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Banner */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-purple-50 to-indigo-50 p-6 mb-8 h-48">
          <div className="absolute right-6 top-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full opacity-30"></div>
          </div>
          <h2 className="text-2xl font-bold text-purple-800 mb-2">Antique Giraffe</h2>
          <p className="text-purple-600 mb-4">Banner Alert Okapi e</p>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Explore
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bar ....."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 w-full"
            />
          </div>
          
          <div className="flex space-x-2 shrink-0">
            <select className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 bg-white">
              <option>Group by</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 bg-white">
              <option>Filter</option>
            </select>
            <select className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 bg-white">
              <option>Sort by...</option>
            </select>
          </div>
        </div>

        {/* Sections */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">Top Regional Selections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="h-40 bg-purple-50 rounded-lg mb-3"></div>
              <h4 className="font-medium text-purple-900">Brave Salmon</h4>
            </div>
            {/* Add more items here */}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">Previous Trips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="h-40 bg-purple-50 rounded-lg mb-3"></div>
              <h4 className="font-medium text-purple-900">Remarkable Emu</h4>
              <p className="text-sm text-gray-500">Sanskriti Rai</p>
            </div>
            {/* Add more items here */}
          </div>
        </section>

        {/* Floating Action Button */}
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors">
          <FiPlus size={24} />
        </button>
      </main>
    </div>
  );
}