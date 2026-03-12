"use client";

import React from 'react';
import { useUser } from '../../../src/context/UserContext';

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-96 flex flex-col items-center justify-center">
        <p className="text-gray-500">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">User Profile</h1>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-gray-500 font-medium font-sm">Username</span>
          <span className="text-gray-900 font-semibold">{user.username || user.name || 'N/A'}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-gray-500 font-medium font-sm">Email</span>
          <span className="text-gray-900 font-semibold">{user.email}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-gray-500 font-medium font-sm">Role</span>
          <span className={`font-semibold px-2 py-1 rounded-md text-sm ${user.role === 'TEACHER' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
            {user.role}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-gray-500 font-medium font-sm">College</span>
          <span className="text-gray-900 font-semibold">{user.college || 'N/A'}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-gray-500 font-medium font-sm">Department</span>
          <span className="text-gray-900 font-semibold">{user.department || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
