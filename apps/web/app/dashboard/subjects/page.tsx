"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '../../../src/context/UserContext';
import { BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: string;
}

export default function SubjectsPage() {
  const { user } = useUser();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Default to student's current sem or SEM1
  const [selectedSemester, setSelectedSemester] = useState<string>((user as any)?.currentSem || 'SEM1');

  // When user loads/changes, align the default semester to their profile
  useEffect(() => {
    const userSem = (user as any)?.currentSem as string | undefined;
    if (userSem && userSem !== selectedSemester) {
      setSelectedSemester(userSem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      setError('');
      try {
        const dept = user?.department || 'CSE';
        const apiBase = process.env.NEXT_PUBLIC_API || "http://localhost:5000";
        const query = new URLSearchParams({ semester: selectedSemester, department: dept }).toString();
        const response = await fetch(`${apiBase}/api/subjects?${query}`);
        const data = await response.json();
        
        if (data.success && data.subjects) {
          setSubjects(data.subjects);
        } else {
          setSubjects([]);
        }
      } catch (err) {
        setError('Failed to load subjects. Please try again.');
        console.error("Subjects fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchSubjects();
    }
  }, [selectedSemester, user]);

  if (!user) return null;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="text-indigo-600" /> Subject Catalog
          </h1>
          <p className="text-gray-500 mt-1">Browse study materials organized by exact subjects in your curriculum.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-600">Filter by Semester:</label>
          <select 
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
          >
            <option value="SEM1">Semester 1</option>
            <option value="SEM2">Semester 2</option>
            <option value="SEM3">Semester 3</option>
            <option value="SEM4">Semester 4</option>
            <option value="SEM5">Semester 5</option>
            <option value="SEM6">Semester 6</option>
            <option value="SEM7">Semester 7</option>
            <option value="SEM8">Semester 8</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 border-dashed p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No subjects found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Your teachers haven't added any subjects to this semester yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <Link key={subject.id} href={`/dashboard/subjects/${subject.id}`}>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {subject.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600">{subject.code}</span>
                  <span>• {subject.semester}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
