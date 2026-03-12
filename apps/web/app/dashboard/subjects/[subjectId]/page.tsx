"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '../../../../src/context/UserContext';
import { ResourceFeed } from '../../../../src/components/resources/ResourceFeed';
import { BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SubjectDetails {
  id: string;
  name: string;
  code: string;
  semester: string;
  department: string;
}

export default function SubjectDetailsPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = React.use(params);
  const { user } = useUser();
  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch precise subject details from a GET /api/subjects/:id
    // But since we only have a list fetch, we can just do a quick manual filter 
    // or just render the feed with the ID!
    const fetchSubjectDetails = async () => {
      try {
        const dept = user?.department || 'CSE';
        const response = await fetch(`http://localhost:5000/api/subjects?department=${dept}`);
        const data = await response.json();
        if (data.success && data.subjects) {
          const found = data.subjects.find((s: SubjectDetails) => s.id === subjectId);
          if (found) setSubject(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubjectDetails();
  }, [subjectId, user]);

  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Link href="/dashboard/subjects" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      ) : subject ? (
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-2xl p-8 md:p-10 text-white mb-8 shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="w-7 h-7 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-indigo-500/40 border border-indigo-400/30 px-2 py-0.5 rounded text-xs font-semibold tracking-wider">
                  {subject.code}
                </span>
                <span className="text-indigo-200 text-sm font-medium">• {subject.semester}</span>
              </div>
              <h1 className="text-3xl font-bold">{subject.name}</h1>
            </div>
          </div>
          <p className="text-indigo-100/80 max-w-2xl">
            Explore all study materials, notes, past papers, and resources specifically uploaded for {subject.name}.
          </p>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Subject Overview</h1>
        </div>
      )}

      {/* Render the generic ResourceFeed locked specifically to this subjectId! */}
      <ResourceFeed key={subjectId} initialSubjectId={subjectId} hideGlobalFilters={true} />
    </div>
  );
}
