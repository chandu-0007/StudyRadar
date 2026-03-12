"use client";

import React, { useState, useEffect } from 'react';
import { Bookmark, Loader2 } from 'lucide-react';

interface BookmarkButtonProps {
  resourceId: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({ resourceId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/resources/${resourceId}/bookmark-status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setIsBookmarked(data.isBookmarked);
        }
      } catch (err) {
        console.error("Failed to fetch bookmark status", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, [resourceId]);

  const toggleBookmark = async () => {
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const method = isBookmarked ? 'DELETE' : 'POST';
      const endpoint = `http://localhost:5000/api/resources/${resourceId}/bookmark`;
      
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setIsBookmarked(!isBookmarked);
        // Optional: show a toast notification here
      } else {
        throw new Error(data.message || 'Failed to toggle bookmark');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update bookmark status.');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <button disabled className="p-2 border border-gray-100 rounded-lg text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin" />
      </button>
    );
  }

  return (
    <button 
      onClick={toggleBookmark}
      disabled={isActionLoading}
      className={`p-2 border rounded-lg shadow-sm flex items-center justify-center transition-colors ${
        isBookmarked 
          ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100' 
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200'
      }`}
      title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      {isActionLoading ? (
         <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
         <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
      )}
    </button>
  );
};
