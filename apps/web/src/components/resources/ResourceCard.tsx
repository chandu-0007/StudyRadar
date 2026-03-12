import React from 'react';
import { Download, Eye, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export interface ResourceItem {
  id: string;
  title: string;
  type: string;
  status: string;
  avgRating: number;
  viewCount: number;
  downloadCount: number;
  fileType: string;
  subject: { name: string; code: string; department: string };
  uploadedBy: { username: string };
  createdAt: string;
}

interface ResourceCardProps {
  resource: ResourceItem;
  role: string;
  onApprove?: (id: string) => void;
  onReport?: (id: string) => void;
  onDownload?: (id: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, role, onApprove, onReport, onDownload }) => {
  const isPending = resource.status === 'PENDING';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative">
      {isPending && (
        <span className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-md font-semibold font-mono">
          PENDING
        </span>
      )}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-md font-semibold">
            {resource.type}
          </span>
          <span className="text-gray-400 text-xs font-mono">• {resource.fileType}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{resource.title}</h3>
        <p className="text-sm text-gray-500 mb-4">
          {resource.subject.code} - {resource.subject.name}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <UserIcon className="w-4 h-4" /> 
            {resource.uploadedBy.username}
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-amber-500" />
            {resource.avgRating.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
        <Link 
          href={`/dashboard/resource/${resource.id}`}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>
        
        <div className="flex gap-2">
          {role === 'TEACHER' && isPending && onApprove && (
            <button 
              onClick={() => onApprove(resource.id)}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Approve Resource"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          )}

          {(!isPending || role === 'TEACHER') && (
            <button 
              onClick={() => onDownload && onDownload(resource.id)}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download File"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
