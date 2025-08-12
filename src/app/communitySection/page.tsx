'use client'
import React, { useState } from 'react';
import { Search, Filter, Star, Plus, MapPin, Calendar, User, Heart, MessageCircle, X } from 'lucide-react';

const CommunityTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [groupBy, setGroupBy] = useState('all');
  const [showNewReviewModal, setShowNewReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    place: '',
    rating: 0,
    title: '',
    content: '',
    images: []
  });

  // Sample reviews data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Sarah Johnson',
      userAvatar: 'SJ',
      place: 'Brave Shark Diving Experience',
      location: 'Great Barrier Reef, Australia',
      rating: 5,
      title: 'Incredible underwater adventure!',
      content: 'Just returned from the most amazing shark diving experience. The crew was professional, safety was top priority, and seeing those magnificent creatures up close was life-changing. The visibility was perfect and we saw 6 different shark species!',
      date: '2 days ago',
      likes: 24,
      comments: 8,
      images: ['shark1.jpg']
    },
    {
      id: 2,
      user: 'Mike Chen',
      userAvatar: 'MC',
      place: 'Santorini Sunset Point',
      location: 'Oia, Santorini, Greece',
      rating: 4,
      title: 'Beautiful but crowded',
      content: 'The sunset views are absolutely stunning, but be prepared for massive crowds. Arrive early to get a good spot. The restaurants nearby are overpriced but the experience is worth it.',
      date: '1 week ago',
      likes: 18,
      comments: 5,
      images: []
    },
    {
      id: 3,
      user: 'Emma Wilson',
      userAvatar: 'EW',
      place: 'Machu Picchu Trek',
      location: 'Cusco, Peru',
      rating: 5,
      title: 'Journey of a lifetime',
      content: 'The 4-day Inca Trail was challenging but absolutely rewarding. Our guide was knowledgeable about the history and culture. The sunrise at Machu Picchu was magical. Book months in advance!',
      date: '2 weeks ago',
      likes: 42,
      comments: 12,
      images: ['machu1.jpg', 'machu2.jpg']
    }
  ]);

  type StarRatingProps = {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean;
  };

  const StarRating = ({ rating, onRatingChange, readOnly = true }: StarRatingProps) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 transition-all duration-200 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${!readOnly ? 'cursor-pointer hover:text-yellow-400 hover:scale-110' : ''}`}
            onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  type Review = {
    id: number;
    user: string;
    userAvatar: string;
    place: string;
    location: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    likes: number;
    comments: number;
    images: string[];
  };

  const ReviewCard = ({ review }: { review: Review }) => (
    <div className="bg-white rounded-2xl border border-purple-100 p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {review.userAvatar}
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{review.user}</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>{review.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <StarRating rating={review.rating} />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              <h4 className="font-bold text-xl mb-2">{review.place}</h4>
            </div>
            <p className="font-semibold text-gray-800 mb-3 text-lg">{review.title}</p>
            <p className="text-gray-600 leading-relaxed text-base">{review.content}</p>
          </div>

          {review.images.length > 0 && (
            <div className="flex gap-3 mb-4">
              {review.images.map((img, index) => (
                <div key={index} className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-purple-500 text-sm font-medium shadow-md">
                  IMG
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 text-sm">
            <button className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-all duration-200 hover:scale-105 font-medium">
              <Heart className="w-5 h-5" />
              <span>{review.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-purple-500 transition-all duration-200 hover:scale-105 font-medium">
              <MessageCircle className="w-5 h-5" />
              <span>{review.comments}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NewReviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Share Your Experience</h2>
            <p className="text-gray-500 mt-1">Help fellow travelers with your insights</p>
          </div>
          <button
            onClick={() => setShowNewReviewModal(false)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Place/Attraction Name
            </label>
            <input
              type="text"
              value={newReview.place}
              onChange={(e) => setNewReview({ ...newReview, place: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base"
              placeholder="e.g., Eiffel Tower, Bali Beach Resort"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              <StarRating
                rating={newReview.rating}
                onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                readOnly={false}
              />
              <span className="text-sm text-gray-500 ml-2">
                {newReview.rating > 0 && `${newReview.rating} out of 5 stars`}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Review Title
            </label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base"
              placeholder="Give your review a catchy title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Experience
            </label>
            <textarea
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all text-base"
              placeholder="Share details about your experience, tips for other travelers, what made it special..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Add Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-gray-600 font-medium">Click to upload photos or drag and drop</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => {
                if (newReview.place && newReview.rating && newReview.title && newReview.content) {
                  const review = {
                    id: reviews.length + 1,
                    user: 'You',
                    userAvatar: 'YOU',
                    place: newReview.place,
                    location: 'Your Location',
                    rating: newReview.rating,
                    title: newReview.title,
                    content: newReview.content,
                    date: 'Just now',
                    likes: 0,
                    comments: 0,
                    images: []
                  };
                  setReviews([review, ...reviews]);
                  setNewReview({ place: '', rating: 0, title: '', content: '', images: [] });
                  setShowNewReviewModal(false);
                }
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Post Review
            </button>
            <button
              onClick={() => setShowNewReviewModal(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredReviews = reviews.filter(review =>
    review.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-purple-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg"></div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">GlobalTrotter</h1>
                <p className="text-sm text-gray-500">Community Reviews</p>
              </div>
            </div>
            <div className="w-8 h-8 border-2 border-purple-200 rounded-lg"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Search places, reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base min-w-[120px]"
              >
                <option value="all">Group by</option>
                <option value="location">Location</option>
                <option value="rating">Rating</option>
                <option value="user">User</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all font-medium">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base min-w-[140px]"
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rating</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Community Reviews</h2>
              <p className="text-gray-500 text-sm mt-1">{filteredReviews.length} reviews found</p>
            </div>
            <button
              onClick={() => setShowNewReviewModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add Review
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No reviews found</h3>
            <p className="text-gray-500 mb-8 text-lg max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search terms to find more reviews' : 'Be the first to share your amazing travel experience with our community!'}
            </p>
            <button
              onClick={() => setShowNewReviewModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      {/* New Review Modal */}
      {showNewReviewModal && <NewReviewModal />}
    </div>
  );
};

export default CommunityTab;