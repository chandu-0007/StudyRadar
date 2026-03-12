import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CollegeDetailsFormProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CollegeDetailsForm: React.FC<CollegeDetailsFormProps> = ({ data, updateData, onNext, onBack }) => {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!data.college || !data.department) {
      setError('College and Department are required.');
      return;
    }
    if (data.role === 'student' && !data.semester) {
      setError('Semester is required for students.');
      return;
    }
    setError('');
    onNext();
  };

  const themeClass = data.role === 'student' ? 'text-indigo-600' : 'text-emerald-600';
  const buttonVariant = data.role === 'student' ? 'primary' : 'secondary';

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Academic Info</h2>
        <p className="text-gray-500 mt-2">Tell us about your institution</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="College Name"
          type="text"
          placeholder="e.g. Stanford University"
          value={data.college}
          onChange={(e) => updateData({ college: e.target.value })}
          required
        />

        <div className="flex flex-col w-full text-left">
          <label className="text-sm font-medium text-gray-700 mb-1">Department / Branch</label>
          <select
            className="px-4 py-2 text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white"
            value={data.department || ''}
            onChange={(e) => updateData({ department: e.target.value })}
            required
          >
            <option value="" disabled>Select Department</option>
            <option value="CSE">Computer Science (CSE)</option>
            <option value="IT">Information Technology (IT)</option>
            <option value="ECE">Electronics and Communication (ECE)</option>
            <option value="EEE">Electrical and Electronics (EEE)</option>
            <option value="MECH">Mechanical Engineering (MECH)</option>
            <option value="CIVIL">Civil Engineering (CIVIL)</option>
          </select>
        </div>

        {data.role === 'student' && (
          <div className="flex flex-col w-full text-left">
            <label className="text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select
              className="px-4 py-2 text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow bg-white"
              value={data.semester || ''}
              onChange={(e) => updateData({ semester: e.target.value })}
              required
            >
              <option value="" disabled>Select Semester</option>
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
        )}
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 rounded-lg font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <Button onClick={handleNext} variant={buttonVariant}>
          Next Step
        </Button>
      </div>
    </div>
  );
};
