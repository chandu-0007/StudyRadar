"use client";

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface StudySearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const StudySearchBar: React.FC<StudySearchBarProps> = ({ 
  initialQuery = "", 
  onSearch, 
  isLoading 
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto shadow-sm group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {isLoading ? (
          <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
        ) : (
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        )}
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search topics, subjects or units... Example: 'DBMS Unit 4'"
        className="block w-full pl-11 pr-24 py-4 border border-gray-200 rounded-2xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-base shadow-sm"
      />
      
      <div className="absolute inset-y-2 right-2 flex items-center">
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Search
        </button>
      </div>
    </form>
  );
};
