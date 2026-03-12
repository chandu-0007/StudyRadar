"use client";

import React from 'react';

interface Filters {
  department: string;
  semester: string;
  type: string;
  status: string;
}

interface ResourceFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  role: string;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({ filters, setFilters, role }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs font-semibold text-gray-500 uppercase">Department</label>
        <select 
          name="department" 
          value={filters.department} 
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
          <option value="IT">IT</option>
        </select>
      </div>

      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs font-semibold text-gray-500 uppercase">Semester</label>
        <select 
          name="semester" 
          value={filters.semester} 
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Semesters</option>
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

      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
        <select 
          name="type" 
          value={filters.type} 
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Types</option>
          <option value="NOTES">Notes</option>
          <option value="PPT">Presentation</option>
          <option value="PAST_PAPER">Past Papers</option>
          <option value="TEXTBOOK">Textbooks</option>
          <option value="LAB_MANUAL">Lab Manuals</option>
          <option value="SYLLABUS">Syllabus</option>
          <option value="VIDEO">Videos</option>
        </select>
      </div>

      {role === 'TEACHER' && (
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending Approval</option>
            <option value="REJECTED">Rejected</option>
            <option value="FLAGGED">Flagged</option>
          </select>
        </div>
      )}
    </div>
  );
};
