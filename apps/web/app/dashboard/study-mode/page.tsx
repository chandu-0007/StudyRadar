"use client";

import React, { useState, useCallback } from 'react';
import { useUser } from '../../../src/context/UserContext';
import { StudySearchBar } from '../../../src/components/study/StudySearchBar';
import { StudyResults } from '../../../src/components/study/StudyResults';
import { ResourceItem } from '../../../src/components/resources/ResourceCard';
import { BookOpen, Sparkles } from 'lucide-react';

export default function StudyModePage() {
  const { user } = useUser();
  const [query, setQuery] = useState('');
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Example pagination states (we'll fetch limit 30 for study mode to give exhaustive list)
  const [page, setPage] = useState(1);

  const performSearch = useCallback(async (searchQuery: string, loadMore = false) => {
    if (!searchQuery.trim()) return;

    if (!loadMore) {
      setIsLoading(true);
      setPage(1);
    }
    
    setError(null);
    setHasSearched(true);
    setQuery(searchQuery);

    try {
      const token = localStorage.getItem('token');
      // Using an aggressive limit to ensure students find what they need in Study Mode.
      const currentPage = loadMore ? page + 1 : 1;
      
      const queryParams = new URLSearchParams({
        q: searchQuery,
        page: currentPage.toString(),
        limit: '24'
      });

      const response = await fetch(`http://localhost:5000/api/resources/search?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Search failed. Please try again.');
      }

      const incoming = data.resources || data.data || [];
      if (loadMore) {
        setResources(prev => [...prev, ...incoming]);
        setPage(currentPage);
      } else {
        setResources(incoming);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const handleDownload = async (id: string, customFileUrl?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/resources/${id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.fileUrl) {
         window.open(data.fileUrl, '_blank');
      } else if (customFileUrl) {
         window.open(customFileUrl, '_blank'); // fallback
      } else {
        alert("File couldn't be loaded natively.");
      }
    } catch (err) {
       console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto pb-10">
      <div className="mb-10 text-center flex flex-col items-center justify-center pt-8">
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 inline-flex items-center gap-2 shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-500" /> Focus Mode Enabled
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Study Mode</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 font-medium">
           Our proprietary smart index ranks past papers and verified class notes. What are we revising today?
        </p>
        
        <StudySearchBar 
           onSearch={(q: string) => performSearch(q)} 
           isLoading={isLoading} 
           initialQuery={query}
        />
      </div>

      <StudyResults 
         resources={resources}
         isLoading={isLoading}
         error={error}
         hasSearched={hasSearched}
         onDownload={handleDownload}
      />
    </div>
  );
}
