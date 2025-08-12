"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { FiSearch, FiPlus, FiCompass, FiMap, FiHeart, FiUser, FiHome, FiChevronDown } from "react-icons/fi";

export default function SignupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    password: "",
    additionalInfo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setError('');
    setImageUploading(true);
    
    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      // Validate file is not corrupted
      if (file.size === 0) {
        throw new Error('Selected file is empty or corrupted');
      }

      // Set the profile image
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setImagePreview(result as string);
        }
      };
      reader.onerror = () => {
        throw new Error('Failed to read image file');
      };
      reader.readAsDataURL(file);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      console.error('Image processing error:', err);
      // Reset file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setProfileImage(null);
      setImagePreview('');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields before submission
      if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
        throw new Error('Username, email, and password are required');
      }

      // Validate password strength
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const formPayload = new FormData();
      
      // Append all form data (only non-empty values)
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim()) {
          formPayload.append(key, value.trim());
        }
      });

      // Append the image file if it exists
      if (profileImage) {
        console.log('Appending image:', {
          name: profileImage.name,
          size: profileImage.size,
          type: profileImage.type
        });
        formPayload.append('profileImage', profileImage, profileImage.name);
      }

      // Log what we're sending (for debugging)
      console.log('Form submission data:');
      for (const [key, value] of formPayload.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, { name: value.name, size: value.size, type: value.type });
        } else {
          console.log(`${key}:`, value);
        }
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        body: formPayload,
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
          }
        } else {
          // Non-JSON response, get text
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Registration successful, Check your mail:', data);
      localStorage.setItem("userEmail", formData.email);
      
      setSuccess(true);

      // Redirect to home after 2 seconds
      setTimeout(() => router.push("/"), 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      setError("");

      const formPayload = new FormData();
      if (credentialResponse.credential) {
        formPayload.append('googleToken', credentialResponse.credential);
      } else {
        throw new Error("Google credential is missing. Please try again.");
      }
      
      if (profileImage) {
        formPayload.append('profileImage', profileImage, profileImage.name);
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Google registration failed' }));
        throw new Error(errorData.error || "Google registration failed");
      }

      const data = await response.json();
      router.push("/");
      
    } catch (err) {
      console.error('Google registration error:', err);
      setError(err instanceof Error ? err.message : "Google registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google registration failed. Please try again or use email registration.");
  };

  // Reset image function
  const resetImage = () => {
    setProfileImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="w-full max-w-lg bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 relative z-10 transform transition-all duration-500 hover:shadow-purple-500/25">
          {/* Profile Image Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div 
                className="relative w-28 h-28 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center border-4 border-white shadow-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group overflow-hidden"
                onClick={handleImageClick}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetImage();
                      }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-110 shadow-lg"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="text-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mx-auto mb-1 group-hover:scale-110 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-xs font-medium">
                      Add Photo
                    </span>
                  </div>
                )}
                
                {imageUploading && (
                  <div className="absolute inset-0 bg-purple-900/50 rounded-full flex items-center justify-center">
                    <svg
                      className="animate-spin h-8 w-8 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="hidden"
                key={imagePreview ? 'with-image' : 'no-image'}
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">
              Registration Screen
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {success ? (
            <div className="text-center">
              <div className="mb-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Registration Successful
                </h2>
                <p className="text-gray-600 font-medium">
                  Your account has been created successfully.
                </p>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-2xl text-sm border border-red-200 shadow-lg flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mr-3 flex items-center justify-center flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-gray-800 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300"
                      placeholder="Choose a username"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-purple-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 text-gray-800 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-purple-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-800 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300"
                      placeholder="Phone Number"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-bold text-purple-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-800 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-bold text-purple-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-gray-800 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300"
                    placeholder="Country"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-purple-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 text-gray-800 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300"
                    placeholder="Enter your password"
                  />
                  <p className="text-xs text-purple-600 mt-2 font-medium">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-bold text-purple-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 text-gray-800 bg-purple-50/50 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 hover:border-purple-300 resize-vertical"
                    placeholder="Additional information..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || imageUploading}
                  className={`w-full py-4 px-6 rounded-2xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-300 transform hover:scale-[1.02] transition-all duration-300 ${
                    loading || imageUploading ? "opacity-70 cursor-not-allowed scale-100" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {imageUploading ? "Processing Image..." : "Registering..."}
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-purple-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-purple-600 font-bold">
                      Or register with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="w-full bg-white border-2 border-purple-200 rounded-2xl p-1 hover:border-purple-400 transition-colors duration-300">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                      shape="rectangular"
                      text="signup_with"
                      width="100%"
                      logo_alignment="left"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center text-sm">
                <span className="text-purple-600 font-medium">Already have an account? </span>
                <Link
                  href="/"
                  className="font-bold text-purple-700 hover:text-purple-900 transition-colors duration-300 underline decoration-purple-300 hover:decoration-purple-500 underline-offset-2"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}