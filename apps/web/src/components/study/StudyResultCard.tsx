import React from 'react';
import { Download, ExternalLink, Star } from 'lucide-react';
import Link from 'next/link';
import { ResourceItem } from '../resources/ResourceCard';
import { BookmarkButton } from '../bookmarks/BookmarkButton';

interface StudyResultCardProps {
  resource: ResourceItem;
  onDownload: (id: string, fileUrl?: string) => void;
}

export const StudyResultCard: React.FC<StudyResultCardProps> = ({ resource, onDownload }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:border-indigo-200 transition-colors group relative overflow-hidden">
      {/* Decorative gradient strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex gap-2 items-center text-xs font-semibold">
            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded w-fit">
              {resource.type}
            </span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded w-fit capitalize font-mono text-[10px]">
              {resource.fileType}
            </span>
            {(resource as any).unit && (
               <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded w-fit border border-purple-100">
                  Unit {(resource as any).unit}
               </span>
            )}
          </div>
          <BookmarkButton resourceId={resource.id} />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
           {resource.title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">
          {resource.subject.code} - {resource.subject.name} ({(resource as any).semester})
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            <UserIcon className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium">{resource.uploadedBy.username}</span>
            {((resource.uploadedBy as any).role === 'TEACHER' || (resource.uploadedBy as any).role === 'ADMIN') && (
               <span className="bg-blue-100 text-blue-700 text-[9px] uppercase px-1 rounded ml-1 tracking-wider">Staff</span>
            )}
          </div>
          <div className="flex items-center gap-1 font-semibold text-amber-500 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            {resource.avgRating.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <Link
           href={`/dashboard/resource/${resource.id}`}
           className="text-sm font-semibold text-gray-700 hover:text-indigo-600 flex items-center gap-1.5 transition-colors group/link px-2 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover/link:text-indigo-500" /> Open Viewer
        </Link>
        <button
           onClick={() => onDownload(resource.id, (resource as any).fileUrl)}
           className="text-sm font-semibold flex items-center gap-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-100"
        >
          <Download className="w-4 h-4" /> <span className="hidden sm:inline">Get File</span> 
          <span className="text-emerald-700/60 ml-1 text-xs font-mono bg-emerald-100/50 px-1 rounded">{(resource.downloadCount || 0)}</span>
        </button>
      </div>
    </div>
  );
};

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
