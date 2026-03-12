"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../src/context/UserContext';
import { TeacherStatCard } from '../../../../src/components/teacher/TeacherStatCard';
import { TeacherSubjectChart } from '../../../../src/components/teacher/TeacherSubjectChart';
import { 
  FileText, 
  DownloadIcon, 
  Clock, 
  Trophy, 
  Loader2, 
  AlertTriangle 
} from 'lucide-react';

interface TeacherAnalyticsData {
  totalResources: number;
  totalDownloads: number;
  pendingResources: number;
  topResource: { title: string; downloads: number } | null;
  resourcesBySubject: { subject: string; count: number }[];
}

export default function TeacherAnalyticsPage() {
  const { user } = useUser();
  const [data, setData] = useState<TeacherAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/dashboard/teacher-analytics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch analytics');
        }
        
        setData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && (user.role === 'TEACHER' || user.role === 'ADMIN')) {
      fetchAnalytics();
    }
  }, [user]);

  if (!user) return null;

  if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">Only authorized teachers can view analytics.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Analytics hub</h1>
        <p className="text-gray-500 mt-2">Gain powerful insights on your shared resources and student engagement metrics.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-500 font-medium tracking-wide">Crunching the numbers...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 border border-red-200 rounded-xl mb-6 flex items-center gap-3 shadow-sm">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <span className="font-medium text-sm">Error Loading Analytics: {error}</span>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TeacherStatCard
              title="My Resources"
              value={data.totalResources}
              icon={<FileText className="w-6 h-6" />}
              colorClass="text-indigo-600"
              bgColorClass="bg-indigo-50"
              subtitle="Files you uploaded"
            />
            <TeacherStatCard
              title="Total Downloads"
              value={data.totalDownloads}
              icon={<DownloadIcon className="w-6 h-6" />}
              colorClass="text-emerald-600"
              bgColorClass="bg-emerald-50"
              subtitle="Engagement impact"
            />
            <TeacherStatCard
              title="Pending Approvals"
              value={data.pendingResources}
              icon={<Clock className="w-6 h-6" />}
              colorClass="text-orange-600"
              bgColorClass="bg-orange-50"
              subtitle="Needs your action"
            />
            <TeacherStatCard
              title="Top Resource"
              value={data.topResource?.title && data.topResource.title !== "N/A" ? "🥇" : "-"}
              subtitle={data.topResource?.title !== "N/A" ? `${data.topResource?.title.substring(0, 20)}${data.topResource?.title && data.topResource.title.length > 20 ? '...' : ''} (${data.topResource?.downloads || 0} hits)` : "No resources"}
              icon={<Trophy className="w-6 h-6" />}
              colorClass="text-yellow-600"
              bgColorClass="bg-yellow-50"
            />
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1">Upload Distribution by Subject</h3>
              <p className="text-sm text-gray-500">Visualize which topics you are covering the most.</p>
            </div>
            
            <TeacherSubjectChart data={data.resourcesBySubject} />
          </div>
        </>
      ) : null}
    </div>
  );
}
