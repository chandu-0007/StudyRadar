"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ProfileDropdown } from './ProfileDropdown';
import { useUser } from '../../context/UserContext';

export const Navbar = () => {
  const { user } = useUser();

  // Loading skeleton or fallback if user state isn't populated early enough
  const displayUser = user || { name: 'Loading...', email: 'loading...' };

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left Side: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform group-hover:-rotate-6 transition-transform">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              StudyRadar
            </span>
          </Link>
        </div>

        {/* Middle: Search (Optional placeholder) */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search resources, subjects..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm"
            />
          </div>
        </div>

        {/* Right Side: Profile Dropdown */}
        <div className="flex items-center gap-4">
          <ProfileDropdown user={displayUser as any} />
        </div>
      </div>
    </header>
  );
};
