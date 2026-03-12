"use client";

import React from 'react';
import { ResourceItem } from '../resources/ResourceCard';
import { StudyResultCard } from './StudyResultCard';
import { SearchX, Loader2 } from 'lucide-react';

interface StudyResultsProps {
  resources: ResourceItem[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  onDownload: (id: string, fileUrl?: string) => void;
}

export const StudyResults: React.FC<StudyResultsProps> = ({ 
  resources, 
  isLoading, 
  error, 
  hasSearched, 
  onDownload 
}) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-3 w-full max-w-4xl mx-auto mt-8 shadow-sm">
        <SearchX className="w-6 h-6 shrink-0" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (isLoading) {
     return (
       <div className="flex flex-col items-center justify-center py-24 gap-4">
         <div className="relative">
           <div className="w-12 h-12 border-4 border-indigo-100 rounded-full flex items-center justify-center"></div>
           <Loader2 className="w-8 h-8 text-indigo-500 animate-spin absolute top-2 left-2" />
         </div>
         <p className="text-gray-500 font-medium">Scouring the library...</p>
       </div>
     );
  }

  if (!hasSearched) {
     return (
       <div className="bg-white border border-gray-100 shadow-sm p-12 mt-12 mb-8 rounded-3xl max-w-4xl mx-auto text-center border-dashed">
         <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
           </svg>
         </div>
         <h2 className="text-xl font-bold text-gray-900 mb-2">Smart Academic Search</h2>
         <p className="text-gray-500 max-w-sm mx-auto">
            Powered by advanced metadata ranking. Try searching for specific topics, exact exact unit numbers, or syllabus chapters.
         </p>
         <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-500">"Operating Systems Unit 1"</span>
            <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-500">"Linear Algebra Past Paper"</span>
            <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-500">"Data Structures Sort"</span>
         </div>
       </div>
     );
  }

  if (resources.length === 0) {
     return (
       <div className="bg-white border border-gray-200 border-dashed p-16 mt-8 rounded-3xl max-w-4xl mx-auto text-center shadow-sm">
         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
           <SearchX className="w-8 h-8 text-gray-400" />
         </div>
         <h3 className="text-lg font-bold text-gray-900 mb-2">No results found</h3>
         <p className="text-gray-500 max-w-sm mx-auto">
           We couldn't find any documents matching your query. Try using simpler terms or checking alternative spellings.
         </p>
       </div>
     );
  }

  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
           Top Results <span className="text-gray-400 ml-2 font-normal text-sm">{resources.length} documents found</span>
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resources.map((resource) => (
          <StudyResultCard 
             key={resource.id} 
             resource={resource} 
             onDownload={onDownload} 
          />
        ))}
      </div>
    </div>
  );
};
