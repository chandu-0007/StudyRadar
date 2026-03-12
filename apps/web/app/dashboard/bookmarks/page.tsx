"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../../../src/context/UserContext';
import { ResourceCard, ResourceItem } from '../../../src/components/resources/ResourceCard';
import { Loader2, Bookmark, BookmarkX } from 'lucide-react';
import Link from 'next/link';

export default function BookmarksPage() {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/bookmarks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookmarks');
      }

      setBookmarks(data.bookmarks || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === 'STUDENT') {
      fetchBookmarks();
    }
  }, [user, fetchBookmarks]);

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
        window.open(data.fileUrl, '_blank');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = async (resourceId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/resources/${resourceId}/bookmark`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setBookmarks(prev => prev.filter(b => b.resourceId !== resourceId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  if (user.role !== 'STUDENT') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold">Only students have bookmarks.</h2>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center gap-3 relative">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 flex items-center justify-center rounded-xl absolute -left-16 hidden md:flex shadow-sm border border-amber-200">
          <Bookmark className="w-6 h-6 fill-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">My Bookmarks</h1>
          <p className="text-gray-500 mt-2">Access your saved study materials instantly.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded-xl mb-6 flex items-center gap-2">
           <BookmarkX className="w-5 h-5" />
           {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white border text-center py-24 rounded-2xl border-dashed border-gray-300 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Bookmark className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-500 font-medium mb-6 max-w-sm mx-auto">
            You haven't bookmarked any notes yet. Explore resources and save them here for quick access later!
          </p>
          <Link href="/dashboard/explore" className="inline-flex px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-sm">
             Explore Resources
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="relative group">
              <ResourceCard 
                resource={bookmark.resource as ResourceItem} 
                role={user.role || 'STUDENT'} 
                onDownload={handleDownload}
              />
              <button 
                onClick={() => handleRemoveBookmark(bookmark.resourceId)}
                className="absolute top-4 left-4 p-1.5 bg-white border border-gray-200 text-amber-500 rounded-lg hover:bg-amber-50 hover:border-amber-200 transition-colors z-10 shadow-sm"
                title="Remove Bookmark"
              >
                <BookmarkX className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
