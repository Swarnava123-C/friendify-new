"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ClerkAuthPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/discover");
    }
  }, [user, isLoaded, router]);

  // Show auth page immediately, don't wait for Clerk to load
  if (!isLoaded) {
    // Show auth page with a fallback
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to Friendify
              </h1>
              <p className="text-white/70">
                Please wait while we load the authentication...
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
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

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Friendify
            </h1>
            <p className="text-white/70 mt-2">
              {isLogin ? "Welcome back!" : "Join the community!"}
            </p>
          </div>

          {/* Clerk Auth Components */}
          <div className="flex justify-center">
            {isLogin ? (
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl",
                    headerTitle: "text-white text-2xl font-bold",
                    headerSubtitle: "text-white/70",
                    socialButtonsBlockButton:
                      "bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 font-semibold mb-3",
                    formButtonPrimary:
                      "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105",
                    formFieldInput:
                      "bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent",
                    formFieldLabel: "text-white/90",
                    footerActionLink: "text-purple-300 hover:text-purple-200",
                    identityPreviewText: "text-white/70",
                    formResendCodeLink: "text-purple-300 hover:text-purple-200",
                    dividerLine: "bg-white/20",
                    dividerText: "text-white/60",
                  },
                }}
                redirectUrl="/discover"
              />
            ) : (
              <SignUp
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-3xl",
                    headerTitle: "text-white text-2xl font-bold",
                    headerSubtitle: "text-white/70",
                    socialButtonsBlockButton:
                      "bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 font-semibold mb-3",
                    formButtonPrimary:
                      "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105",
                    formFieldInput:
                      "bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent",
                    formFieldLabel: "text-white/90",
                    footerActionLink: "text-purple-300 hover:text-purple-200",
                    identityPreviewText: "text-white/70",
                    formResendCodeLink: "text-purple-300 hover:text-purple-200",
                    dividerLine: "bg-white/20",
                    dividerText: "text-white/60",
                  },
                }}
                redirectUrl="/profile"
              />
            )}
          </div>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
