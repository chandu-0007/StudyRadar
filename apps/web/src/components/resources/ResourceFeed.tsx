"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ResourceCard, ResourceItem } from './ResourceCard';
import { ResourceFilters } from './ResourceFilters';
import { useUser } from '../../context/UserContext';
import { Loader2 } from 'lucide-react';

export const ResourceFeed = ({ 
  initialSubjectId, 
  initialStatus,
  initialSemester,
  hideGlobalFilters = false
}: { 
  initialSubjectId?: string; 
  initialStatus?: string;
  initialSemester?: string;
  hideGlobalFilters?: boolean;
}) => {
  const { user } = useUser();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    department: '',
    // For subject-specific views, we rely primarily on subjectId.
    // Semester can still be set via filters UI in explorer.
    semester: initialSemester || '',
    type: '',
    status: initialStatus !== undefined ? initialStatus : (user?.role === 'TEACHER' ? '' : 'APPROVED'), // students only see APPROVED by default
    subjectId: initialSubjectId || ''
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchResources = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;
      if (reset) {
        setIsLoading(true);
        setPage(1);
        setResources([]); // Clear old content so loader displays immediately
      }

      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(filters.department && { department: filters.department }),
        ...(filters.semester && { semester: filters.semester }),
        ...(filters.type && { type: filters.type }),
        ...(filters.subjectId && { subjectId: filters.subjectId }),
        ...(filters.status && { status: filters.status }),
      });

      const apiBase = process.env.NEXT_PUBLIC_API || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/resources?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch resources');
      }

      setResources(prev => reset ? data.resources || data.data || [] : [...prev, ...(data.resources || data.data || [])]);
      
      // simple pagination check (assuming standard pagination payload format)
      const fetchedItems = data.resources || data.data || [];
      if (fetchedItems.length < 12) {
        setHasMore(false);
      } else {
        setHasMore(true);
        if (!reset) setPage(p => p + 1);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchResources(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // refetch fully when filters change

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/resources/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        // optimistically update UI
        setResources(resources.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
        alert('Resource approved successfully');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to approve resource');
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/resources/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.fileUrl) {
        // Trigger download
        window.open(data.fileUrl, '_blank');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to download resource');
    }
  };

  if (!user) return null;

  return (
    <div className="w-full">
      <ResourceFilters 
        filters={filters} 
        setFilters={setFilters} 
        role={user.role || 'STUDENT'} 
        hideGlobalFilters={hideGlobalFilters}
      />
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded-xl mb-6">
          {error}
        </div>
      )}

      {isLoading && resources.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white border text-center py-24 rounded-2xl border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">No resources found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              role={user.role || 'STUDENT'} 
              onApprove={handleApprove}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {hasMore && !isLoading && resources.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => fetchResources(false)}
            className="px-6 py-2 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
