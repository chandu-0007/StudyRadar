"use client";

import React, { useState } from 'react';
import { useUser } from '../../../../src/context/UserContext';
import { PlusCircle, Loader2, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminSubjectsPage() {
  const { user } = useUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    semester: 'SEM5', // Default starting semantic based on prompt
    name: '',
    code: '',
    department: user?.department || 'CSE'
  });

  // Security redirect for non-teachers/admins
  if (!user) return null;
  if (!['TEACHER', 'ADMIN'].includes(user.role || '')) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-100 mt-10">
        <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-gray-500">Only authorized teaching staff can manage curriculum subjects.</p>
        <button onClick={() => router.push('/dashboard/explore')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subject');
      }

      setSuccess(`Subject "${data.subject.name}" successfully added to ${data.subject.semester}!`);
      setFormData({ ...formData, name: '', code: '' }); // reset text inputs but keep sem/dept
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Curriculum Management</h1>
          <p className="text-gray-500 text-sm">Add subjects explicitly grouped by their semester progression.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        {error && (
          <div className="mb-6 bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 text-green-700 border border-green-200 p-4 rounded-xl text-sm">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Semester</label>
            <select 
              name="semester" 
              value={formData.semester} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 px-4 py-3 bg-gray-50"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select 
              name="department" 
              value={formData.department} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 px-4 py-3 bg-gray-50"
            >
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="IT">IT</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">Defaults to your registered department.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="e.g. Operating Systems"
              className="w-full border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 px-4 py-3"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code (Optional)</label>
            <input 
              type="text" 
              name="code" 
              value={formData.code} 
              onChange={handleChange}
              placeholder="e.g. CS501"
              className="w-full border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 px-4 py-3 uppercase"
            />
            <p className="text-xs text-gray-400 mt-2">A unique database code will be generated if left blank.</p>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                Add Subject
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
