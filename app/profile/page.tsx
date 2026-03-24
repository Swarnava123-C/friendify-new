"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  createUserProfile,
  getUserProfile,
  UserProfile,
} from "@/lib/firestore";

interface ProfileData {
  name: string;
  age: number;
  bio: string;
  interests: string[];
  location: string;
  photos: string[];
  lookingFor: string;
  personality: string[];
}

const INTERESTS = [
  "Music",
  "Sports",
  "Travel",
  "Cooking",
  "Reading",
  "Movies",
  "Gaming",
  "Art",
  "Photography",
  "Dancing",
  "Hiking",
  "Yoga",
  "Fitness",
  "Technology",
  "Fashion",
  "Animals",
  "Volunteering",
  "Learning",
];

const PERSONALITY_TRAITS = [
  "Adventurous",
  "Creative",
  "Funny",
  "Caring",
  "Ambitious",
  "Relaxed",
  "Intellectual",
  "Outgoing",
  "Introverted",
  "Spontaneous",
  "Organized",
  "Optimistic",
  "Supportive",
  "Independent",
  "Loyal",
];

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    age: 25,
    bio: "",
    interests: [],
    location: "",
    photos: [],
    lookingFor: "",
    personality: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [saving, setSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/auth");
    }
  }, [user, isLoaded, router]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const userProfile = await getUserProfile(user.id);
      if (userProfile) {
        setProfile({
          name: userProfile.name || "",
          age: userProfile.age || 25,
          bio: userProfile.bio || "",
          interests: userProfile.interests || [],
          location: userProfile.location || "",
          photos: userProfile.photos || [],
          lookingFor: userProfile.lookingFor || "",
          personality: userProfile.personality || [],
        });
      } else {
        // If no profile exists, pre-fill with Clerk data
        setProfile((prev) => ({
          ...prev,
          name:
            user.firstName ||
            user.emailAddresses[0]?.emailAddress.split("@")[0] ||
            "",
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // If no profile exists, pre-fill with Clerk data
      setProfile((prev) => ({
        ...prev,
        name:
          user.firstName ||
          user.emailAddresses[0]?.emailAddress.split("@")[0] ||
          "",
      }));
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleInterestToggle = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handlePersonalityToggle = (trait: string) => {
    setProfile((prev) => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter((p) => p !== trait)
        : [...prev.personality, trait],
    }));
  };

  const nextStep = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!profile.name.trim() || !profile.location.trim()) {
        alert("Please fill in your name and location to continue.");
        return;
      }
    } else if (currentStep === 2) {
      if (profile.interests.length === 0) {
        alert("Please select at least one interest to continue.");
        return;
      }
    } else if (currentStep === 3) {
      if (!profile.bio.trim()) {
        alert("Please write a bio to continue.");
        return;
      }
    }
    // Step 4 (personality) and Step 5 (photos) are optional

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await createUserProfile(user.id, profile);
      console.log("Profile saved successfully!");
      setProfileSaved(true);

      // Redirect to discover page after a short delay
      setTimeout(() => {
        router.push("/discover");
      }, 2000);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    // Show success screen if profile is saved
    if (profileSaved) {
      return (
        <div className="text-center space-y-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-white"
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
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Profile Complete! 🎉
            </h2>
            <p className="text-white/70 text-lg">
              Your profile has been saved successfully. Redirecting you to
              discover amazing people...
            </p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Tell us about yourself
              </h2>
              <p className="text-white/70">Let's start with the basics</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  What's your name?
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  How old are you?
                </label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      age: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                  min="18"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Where are you located?
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                What are you into?
              </h2>
              <p className="text-white/70">
                Select your interests to help us find better matches
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    profile.interests.includes(interest)
                      ? "border-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg backdrop-blur-sm"
                      : "border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <span className="font-medium">{interest}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Describe yourself
              </h2>
              <p className="text-white/70">
                Help others get to know you better
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Tell us about yourself
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 resize-none"
                  rows={4}
                  placeholder="What makes you unique? What do you enjoy doing?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  What are you looking for in a friend?
                </label>
                <textarea
                  value={profile.lookingFor}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      lookingFor: e.target.value,
                    }))
                  }
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300 resize-none"
                  rows={3}
                  placeholder="Describe the kind of friendship you're seeking"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Your personality
              </h2>
              <p className="text-white/70">Select traits that describe you</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PERSONALITY_TRAITS.map((trait) => (
                <button
                  key={trait}
                  onClick={() => handlePersonalityToggle(trait)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    profile.personality.includes(trait)
                      ? "border-pink-400 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white shadow-lg backdrop-blur-sm"
                      : "border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10 backdrop-blur-sm"
                  }`}
                >
                  <span className="font-medium">{trait}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Add some photos
              </h2>
              <p className="text-white/70">
                Show your personality with photos (optional)
              </p>
            </div>
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center mx-auto hover:border-white/50 transition-all duration-300 cursor-pointer">
                  <div className="text-center">
                    <svg
                      className="w-8 h-8 text-white/60 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="text-white/60 text-sm">Add Photo</p>
                  </div>
                </div>
                <p className="text-white/50 text-sm mt-2">
                  Photo upload coming soon!
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Progress Bar */}
        {!profileSaved && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-white/80 mb-4">
              <span className="font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="font-semibold">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {!profileSaved && (
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-8 py-4 border border-white/20 rounded-2xl text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm"
            >
              Previous
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                {saving ? "Saving..." : "Complete Profile"}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
