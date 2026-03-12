"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle, File, Loader2 } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  code: string;
}

export const UploadForm = () => {
  const { user } = useUser();
  const router = useRouter();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    type: 'NOTES',
    subjectId: '',
    semester: user?.role === 'STUDENT' ? (user as any).currentSem || 'SEM1' : 'SEM1',
    description: '',
    unit: '',
    year: new Date().getFullYear().toString(),
    syllabusMatch: 'true',
    examDate: '',
    examType: 'MID_SEM',
    file: null as File | null
  });

  useEffect(() => {
    // Fetch subjects dynamically
    const fetchSubjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/subjects');
        const data = await response.json();
        if (data.success && data.subjects) {
          setSubjects(data.subjects);
        }
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, file: e.target.files[0] || null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.file) {
      setError('Please attach a file to upload.');
      return;
    }
    if (!formData.subjectId) {
      setError('Please select a subject.');
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('file', formData.file);
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('subjectId', formData.subjectId);
      data.append('semester', formData.semester);
      
      if (formData.unit) data.append('unit', formData.unit);
      if (formData.description) data.append('description', formData.description);
      if (formData.year) data.append('year', formData.year);
      data.append('syllabusMatch', formData.syllabusMatch);

      if (formData.type === 'PAST_PAPER') {
        data.append('examDate', formData.examDate || new Date().getFullYear().toString());
        data.append('examType', formData.examType);
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/resources/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data, // fetch handles multipart boundary automatically
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload resource');
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/explore');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
        <p className="text-gray-500 text-center max-w-sm mb-6">
          Your resource has been submitted. It may need to be approved by a teacher before it appears in exploration feeds.
        </p>
        <p className="text-sm text-gray-400">Redirecting to Dashboard...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex gap-3 items-center">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              placeholder="e.g. Midterm Unit 3 Notes"
              className="w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2"
              required 
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white px-4 py-2"
            >
              <option value="NOTES">Notes</option>
              <option value="PPT">Presentation</option>
              <option value="PAST_PAPER">Past Papers</option>
              <option value="TEXTBOOK">Textbook</option>
              <option value="LAB_MANUAL">Lab Manual</option>
              <option value="SYLLABUS">Syllabus</option>
              <option value="VIDEO">Video Link (PDF placeholder)</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select 
              name="subjectId" 
              value={formData.subjectId} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white px-4 py-2"
              required
            >
              <option value="" disabled>Select a Subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select 
              name="semester" 
              value={formData.semester} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white px-4 py-2"
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

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Provide a brief overview of what this material covers..."
              className="w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2 min-h-[105px] resize-none"
            />
          </div>

          {formData.type !== 'PAST_PAPER' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit # (Optional)</label>
                <input 
                  type="number" 
                  name="unit" 
                  value={formData.unit} 
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  className="w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-4 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matches Syllabus?</label>
                <select 
                  name="syllabusMatch" 
                  value={formData.syllabusMatch} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white px-4 py-2"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          )}

          {formData.type === 'PAST_PAPER' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date / Year</label>
                <input 
                  type="text" 
                  name="examDate" 
                  value={formData.examDate} 
                  onChange={handleChange}
                  placeholder="e.g. 2023 or Nov 2023"
                  className="w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <select 
                  name="examType" 
                  value={formData.examType} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white px-4 py-2"
                >
                  <option value="MID_SEM">Mid Sem</option>
                  <option value="END_SEM">End Sem</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Upload Area */}
      <div className="mt-8">
        <label className="block justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-indigo-400 focus:outline-none overflow-hidden relative">
          <div className="flex flex-col items-center justify-center p-6 gap-2">
            {formData.file ? (
              <>
                <File className="w-8 h-8 text-indigo-500" />
                <span className="font-medium text-gray-900 truncate max-w-xs">{formData.file.name}</span>
                <span className="text-xs text-gray-400">Click to replace file</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-gray-400" />
                <span className="font-medium text-gray-600">
                  Drop files to attach, or <span className="text-indigo-600 hover:text-indigo-500">browse</span>
                </span>
                <span className="text-xs text-gray-400">PDF, PPT, DOC up to 50MB</span>
              </>
            )}
          </div>
          <input type="file" name="file" onChange={handleFileChange} className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4" />
        </label>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            'Submit Resource'
          )}
        </button>
      </div>
    </form>
  );
};

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
