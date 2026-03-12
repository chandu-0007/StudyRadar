"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '../../src/context/UserContext';
import { BarChart3, Users, CheckCircle, Clock, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { ResourceFeed } from '../../src/components/resources/ResourceFeed';

export default function DashboardHomePage() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    pendingApproval: 0,
    totalSubjects: 0,
    yourUploads: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/dashboard/teacher-analytics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          setStats({
            pendingApproval: result.data.pendingResources || 0,
            totalSubjects: result.data.resourcesBySubject?.length || 0,
            yourUploads: result.data.totalResources || 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, [user?.id, user?.role]);

  if (!user) return null;

  if (user.role === 'TEACHER' || user.role === 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Professor {user.username}!</h1>
          <p className="text-gray-500 mt-2">Here's what is happening in the {user.department} department today.</p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Awaiting Approval</p>
              <h3 className="text-3xl font-bold text-orange-600">{stats.pendingApproval}</h3>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Subjects</p>
              <h3 className="text-3xl font-bold text-indigo-600">{stats.totalSubjects}</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Your Resources</p>
              <h3 className="text-3xl font-bold text-emerald-600">{stats.yourUploads}</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* MAIN SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between bg-white p-6 pb-0 rounded-t-2xl border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-orange-500 pl-3">Pending Moderation Queue</h2>
              <Link href="/dashboard/explore" className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-800 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Native Feed forced to PENDING status visually for teacher landing */}
            <div className="bg-white overflow-hidden rounded-b-2xl border border-t-0 border-gray-100 p-6 pt-2">
              <p className="text-sm text-gray-500 mb-4">The following resources were recently uploaded by students and require your approval to become public.</p>
              <ResourceFeed initialStatus="PENDING" />
            </div>
          </div>

          {/* RIGHT SIDEBAR PANEL */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white shadow-md">
              <h3 className="text-lg font-bold mb-2">Subject Management</h3>
              <p className="text-indigo-100/80 text-sm mb-6">Create new curriculum subjects and define the target semester for your students.</p>
              <Link href="/dashboard/admin/subjects">
                <button className="w-full py-2.5 bg-white text-indigo-900 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" /> Manage Subjects
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/dashboard/upload">
                  <div className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Upload Resources</p>
                      <p className="text-xs text-gray-500">Share files with your class</p>
                    </div>
                  </div>
                </Link>
                <Link href="/dashboard/my-resources">
                  <div className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-3 mt-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">My Files</p>
                      <p className="text-xs text-gray-500">Edit or Delete uploads</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // DEFAULT STUDENT VIEW
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-10 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3">Welcome to {user.college}, {user.username}!</h1>
          <p className="text-indigo-100 max-w-lg mb-8">Access thousands of past papers, notes, and direct study materials uploaded by seniors and approved by your teachers.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/explore">
              <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                <Compass className="w-5 h-5" /> Explorer Feed
              </button>
            </Link>
            <Link href="/dashboard/subjects">
              <button className="px-6 py-3 bg-indigo-700/50 text-white border border-indigo-400/50 font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> My Subjects
              </button>
            </Link>
          </div>
        </div>
        
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 bg-indigo-900/20 rounded-full blur-xl"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Upload to Help Others</h3>
            <p className="text-gray-500 text-sm mb-3">Share your midterm notes or rare past papers and climb the leaderboard.</p>
            <Link href="/dashboard/upload" className="text-indigo-600 text-sm font-semibold hover:underline">Upload a Resource →</Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Browse by Semester</h3>
            <p className="text-gray-500 text-sm mb-3">Skip the noise and immediately jump into content tailored exactly for you.</p>
            <Link href="/dashboard/subjects" className="text-emerald-600 text-sm font-semibold hover:underline">View Categories →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Compass(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
  );
}
