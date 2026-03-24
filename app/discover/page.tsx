"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  getPotentialMatches,
  likeUser,
  passUser,
  UserProfile,
} from "@/lib/firestore";

export default function DiscoverPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [passedUsers, setPassedUsers] = useState<string[]>([]);
  const [showMatch, setShowMatch] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const currentUser = users[currentUserIndex];
  const isLastUser = currentUserIndex >= users.length - 1;

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/auth");
    }
  }, [user, isLoaded, router]);

  useEffect(() => {
    if (user) {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    if (!user) return;

    setLoadingUsers(true);

    try {
      const potentialMatches = await getPotentialMatches(user.id);
      setUsers(potentialMatches);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  if (!isLoaded || loadingUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">
            {loadingUsers ? "Loading profiles from database..." : "Loading..."}
          </div>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    if (currentUser && user) {
      try {
        const result = await likeUser(user.id, currentUser.id);
        setLikedUsers((prev) => [...prev, currentUser.id]);

        if (result.isMatch) {
          setShowMatch(true);
          setTimeout(() => {
            setShowMatch(false);
            nextUser();
          }, 2000);
        } else {
          nextUser();
        }
      } catch (error) {
        console.error("Error liking user:", error);
        nextUser();
      }
    }
  };

  const handlePass = async () => {
    if (currentUser && user) {
      try {
        await passUser(user.id, currentUser.id);
        setPassedUsers((prev) => [...prev, currentUser.id]);
        nextUser();
      } catch (error) {
        console.error("Error passing user:", error);
        nextUser();
      }
    }
  };

  const nextUser = () => {
    if (!isLastUser) {
      setCurrentUserIndex((prev) => prev + 1);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            {users.length === 0 ? "No profiles found!" : "No more profiles!"}
          </h2>
          <p className="text-white/70 mb-6">
            {users.length === 0
              ? "No other users in the database yet. Be the first to create a profile!"
              : "Check back later for new potential friends."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentUserIndex(0);
                loadUsers();
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Refresh
            </button>
            {users.length === 0 && (
              <button
                onClick={() => router.push("/profile")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
              >
                Create Profile
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 py-4">
        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
          {/* Photo */}
          <div className="relative h-64 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-3xl font-bold text-white">
                  {currentUser.name[0]}
                </span>
              </div>
            </div>

            {/* Match Badge */}
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <span className="text-xs font-bold text-white">
                  New Profile!
                </span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-4 bg-white/5 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {currentUser.name}
                </h2>
                <p className="text-white/70 text-sm">
                  {currentUser.age} • {currentUser.location}
                </p>
              </div>
            </div>

            <p className="text-white/90 mb-4 leading-relaxed text-sm">
              {currentUser.bio}
            </p>

            {/* Interests */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-white mb-2">
                Interests
              </h3>
              <div className="flex flex-wrap gap-1">
                {currentUser.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white rounded-full text-xs border border-white/20 backdrop-blur-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Personality */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-white mb-2">
                Personality
              </h3>
              <div className="flex flex-wrap gap-1">
                {currentUser.personality.map((trait) => (
                  <span
                    key={trait}
                    className="px-2 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white rounded-full text-xs border border-white/20 backdrop-blur-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={handlePass}
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <button
            onClick={handleLike}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-purple-500/25"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white/70">
            {currentUserIndex + 1} of {users.length} profiles
          </p>
        </div>
      </div>

      {/* Match Modal */}
      {showMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              It's a Match!
            </h3>
            <p className="text-gray-600 mb-6">
              You and {currentUser.name} liked each other! Start a conversation.
            </p>
            <button
              onClick={() => setShowMatch(false)}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start Chatting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
