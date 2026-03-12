"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useParams, useRouter } from 'next/navigation';
import { Download, AlertTriangle, ArrowLeft, Loader2, Star, CheckCircle, ExternalLink } from 'lucide-react';
import { ResourceItem } from './ResourceCard';

export const ResourceViewer = () => {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  
  const [resource, setResource] = useState<ResourceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/resources/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch resource details');
        }
        
        setResource(data.resource);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchResource();
  }, [params.id]);

  const handleDownload = async () => {
    if (!resource) return;
    setIsDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/resources/${resource.id}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.fileUrl) {
        window.open(data.fileUrl, '_blank');
      } else {
        throw new Error('Failed to retrieve file URL');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to launch download.');
    } finally {
      setIsDownloading(false);
    }
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason || reportReason.length < 5) return;
    
    setIsReporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/resources/${resource?.id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: reportReason })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert('Resource reported successfully');
        setShowReportDialog(false);
        setReportReason('');
      } else {
        throw new Error(data.message || 'Failed to report');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsReporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <span className="text-gray-500">Loading document details...</span>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-200">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Whoops! Error loading resource
        </h2>
        <p>{error || "This resource might have been deleted or never existed."}</p>
        <button onClick={() => router.push('/dashboard/explore')} className="mt-4 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg shadow-sm border border-red-200 hover:bg-red-100 transition">
          Return to Explore
        </button>
      </div>
    );
  }

  // To display real PDFs properly dynamically via iframe/embed, we typically need a Google Docs Viewer or native rendering if the cloudinary link is valid.
  // We'll map fileType to a native embed or placeholder.

  return (
    <div className="w-full max-w-7xl relative pb-10">
      
      {/* Top Banner Navigation */}
      <div className="flex items-center gap-4 mb-6 sticky top-[64px] bg-gray-50/95 backdrop-blur-sm z-10 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button 
          onClick={() => router.back()} 
          className="p-2 hover:bg-white rounded-lg text-gray-500 hover:text-gray-900 transition-colors shadow-sm bg-white border border-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate pr-4">{resource.title}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
               Uploaded by <span className="font-semibold text-gray-700">{resource.uploadedBy.username}</span> 
               • {(resource as any).subject?.name || 'Subject'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
             <button
               onClick={handleDownload}
               disabled={isDownloading}
               className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm flex items-center gap-2 transition"
             >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4" />}
                Download
             </button>
             <button
               onClick={() => setShowReportDialog(true)}
               className="p-2 bg-white border border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg shadow-sm transition"
               title="Report Issue"
             >
                <AlertTriangle className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Document Viewer */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-4 h-[600px] flex flex-col relative overflow-hidden">
           {resource.status === 'PENDING' && (
              <div className="bg-amber-50 text-amber-700 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Action Needed</h3>
                  <p className="text-xs">This resource is pending moderator approval.</p>
                </div>
                {user?.role === 'TEACHER' && (
                  <button className="px-3 py-1.5 bg-white text-emerald-600 hover:bg-emerald-50 text-sm font-semibold rounded-lg shadow-sm whitespace-nowrap">
                    Approve Now
                  </button>
                )}
              </div>
           )}

           <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
             {resource.fileType === 'PDF' ? (
                // Use a standard object tag or iframe for PDF embedding. Realistically relies on browser capabilities.
                <iframe 
                  src={(resource as any).fileUrl || ''} 
                  className="w-full h-full rounded-xl bg-white"
                  title={resource.title}
                />
             ) : (
                <div className="flex flex-col items-center text-center p-8 gap-4">
                  <ExternalLink className="w-16 h-16 text-indigo-200" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">Preview not fully supported</h3>
                    <p className="text-gray-500 text-sm max-w-sm">
                      We cannot generate a live preview for {resource.fileType} files directly in the browser right now.
                    </p>
                  </div>
                  <button onClick={handleDownload} className="text-indigo-600 font-semibold hover:underline mt-2">
                    Download file directly
                  </button>
                </div>
             )}
           </div>
        </div>

        {/* Right: Metadata sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Metadata</h3>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Type</dt>
                <dd className="text-gray-900 font-semibold">{resource.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Semester</dt>
                <dd className="text-gray-900 font-semibold">{(resource as any).semester}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Rating</dt>
                <dd className="text-amber-500 font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-500" /> {resource.avgRating.toFixed(1)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Downloads</dt>
                <dd className="text-gray-900 font-semibold">{resource.downloadCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Date Uploaded</dt>
                <dd className="text-gray-900">{new Date(resource.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>

            {(resource as any).description && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {(resource as any).description}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center min-h-[200px]">
             <h3 className="font-bold text-gray-400 mb-2">Comments Area</h3>
             <p className="text-sm text-gray-400">Comments coming soon in a future update.</p>
          </div>
        </div>
      </div>

      {/* Report Dialog Modal Overlay */}
      {showReportDialog && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <form onSubmit={submitReport} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
             <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
               <AlertTriangle className="w-5 h-5 text-red-500" /> Report Content
             </h3>
             <p className="text-sm text-gray-500 mb-4">Please provide a reason. Content is reviewed manually.</p>
             
             <textarea 
               value={reportReason}
               onChange={(e) => setReportReason(e.target.value)}
               className="w-full border border-gray-300 rounded-xl px-4 py-3 min-h-[120px] mb-4 outline-none focus:ring-2 focus:ring-red-500 resize-none"
               placeholder="Briefly describe why this should be removed or changed..."
               required
               minLength={5}
             />
             
             <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowReportDialog(false)} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" disabled={isReporting} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center gap-2 transition disabled:opacity-70">
                  {isReporting && <Loader2 className="w-4 h-4 animate-spin"/>} Submit Report
                </button>
             </div>
           </form>
         </div>
      )}
    </div>
  );
};
