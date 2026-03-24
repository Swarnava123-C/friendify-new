"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  // Don't show navbar on auth pages
  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <nav className="relative z-50 flex justify-between items-center p-6 max-w-7xl mx-auto bg-transparent">
      {/* Logo */}
      <Link
        href="/"
        className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent hover:from-purple-200 hover:to-white transition-all duration-300"
      >
        Friendify
      </Link>

      {/* Navigation Links & User Section */}
      <div className="flex items-center gap-6">
        {isLoaded && user ? (
          <>
            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              <Link
                href="/discover"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  pathname === "/discover"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Discover
              </Link>
              <Link
                href="/chat"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  pathname === "/chat"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Chat
              </Link>
              <Link
                href="/profile"
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  pathname === "/profile"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Profile
              </Link>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full px-3 py-1.5">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  {user.firstName?.[0] ||
                    user.emailAddresses[0]?.emailAddress[0].toUpperCase()}
                </div>
                <span className="text-white/90 text-sm font-medium">
                  {user.firstName ||
                    user.emailAddresses[0]?.emailAddress.split("@")[0]}
                </span>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard:
                      "bg-transparent backdrop-blur-md border border-white/20",
                    userButtonPopoverActionButton:
                      "text-white hover:bg-transparent",
                  },
                }}
              />
            </div>
          </>
        ) : (
          /* Guest Navigation */
          <div className="flex gap-4">
            <Link
              href="/auth"
              className="px-6 py-2 text-white/80 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
