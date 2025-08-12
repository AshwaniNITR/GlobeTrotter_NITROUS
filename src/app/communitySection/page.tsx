"use client"
import React, { useState } from 'react';
import { Search, Filter, Star, Plus, MapPin, Calendar, User, Heart, MessageCircle } from 'lucide-react';

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
  interface Review {
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
}

interface ReviewCardProps {
  review: Review;
}

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

  const StarRating = ({ rating, onRatingChange, readOnly = true }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          } ${!readOnly ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
        />
      ))}
    </div>
  );
};

  const ReviewCard = ({ review }: ReviewCardProps) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
          {review.userAvatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{review.user}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{review.location}</span>
                <Calendar className="w-4 h-4 ml-2" />
                <span>{review.date}</span>
              </div>
            </div>
            <StarRating rating={review.rating} />
          </div>
          
          <div className="mb-3">
            <h4 className="font-medium text-lg text-gray-800 mb-1">{review.place}</h4>
            <p className="font-medium text-gray-700 mb-2">{review.title}</p>
            <p className="text-gray-600 leading-relaxed">{review.content}</p>
          </div>

          {review.images.length > 0 && (
            <div className="flex gap-2 mb-3">
              {review.images.map((img, index) => (
                <div key={index} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                  IMG
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              <span>{review.likes}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{review.comments}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const NewReviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Share Your Experience</h2>
          <button
            onClick={() => setShowNewReviewModal(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-black text-sm font-medium  mb-2">
              Place/Attraction Name
            </label>
            <input
              type="text"
              value={newReview.place}
              onChange={(e) => setNewReview({ ...newReview, place: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Eiffel Tower, Bali Beach Resort"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Your Rating
            </label>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              readOnly={false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Review Title
            </label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Give your review a catchy title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Experience
            </label>
            <textarea
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Share details about your experience, tips for other travelers, what made it special..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-gray-500">Click to upload photos or drag and drop</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
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
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Post Review
            </button>
            <button
              onClick={() => setShowNewReviewModal(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <h1 className="text-xl font-semibold text-gray-800">GlobalTrotter</h1>
            </div>
            <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search places, reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Group by</option>
              <option value="location">Location</option>
              <option value="rating">Rating</option>
              <option value="user">User</option>
            </select>
            
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Sort by...</option>
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rating</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Community Reviews</h2>
            <button
              onClick={() => setShowNewReviewModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Review
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No reviews found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to share your travel experience!'}
            </p>
            <button
              onClick={() => setShowNewReviewModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="space-y-4">
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