import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ProfileDetailsFormProps {
  data: any;
  updateData: (data: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({ 
  data, 
  updateData, 
  onSubmit, 
  onBack,
  isLoading
}) => {
  const buttonVariant = data.role === 'student' ? 'primary' : 'secondary';

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Profile Details</h2>
        <p className="text-gray-500 mt-2">Optional info to complete your profile</p>
      </div>

      <div className="space-y-4">
        {data.role === 'teacher' && (
          <>
            <Input
              label="Full Name (as per staff records)"
              type="text"
              placeholder="e.g. Dr. Sharma"
              value={data.name || ''}
              onChange={(e) => updateData({ name: e.target.value })}
              required
            />

            <Input
              label="Employee ID"
              type="text"
              placeholder="e.g. TCH2024001"
              value={data.employeeId || ''}
              onChange={(e) => updateData({ employeeId: e.target.value })}
              required
            />

            <Input
              label="Designation"
              type="text"
              placeholder="e.g. Assistant Professor"
              value={data.designation || ''}
              onChange={(e) => updateData({ designation: e.target.value })}
              required
            />

            <div className="flex flex-col w-full text-left">
              <label className="text-sm font-medium text-gray-700 mb-1">Upload ID Card Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  updateData({ idCardImage: file });
                }}
                className="px-4 py-2 text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow bg-white"
                required
              />
              {data.idCardImage?.name && (
                <p className="text-xs text-gray-500 mt-1">Selected: {data.idCardImage.name}</p>
              )}
            </div>
          </>
        )}

        {data.role === 'student' && (
          <Input
            label="Graduation Year (Optional)"
            type="number"
            placeholder="e.g. 2026"
            value={data.graduationYear}
            onChange={(e) => updateData({ graduationYear: e.target.value })}
          />
        )}

        <Input
          label="Bio (Optional)"
          type="text"
          placeholder="A short bio about yourself"
          value={data.bio}
          onChange={(e) => updateData({ bio: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="LinkedIn URL (Optional)"
            type="url"
            placeholder="linkedin.com/in/..."
            value={data.linkedin}
            onChange={(e) => updateData({ linkedin: e.target.value })}
          />

          <Input
            label="GitHub URL (Optional)"
            type="url"
            placeholder="github.com/..."
            value={data.github}
            onChange={(e) => updateData({ github: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-2 rounded-lg font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <Button onClick={onSubmit} variant={buttonVariant} disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : (
            'Complete Signup'
          )}
        </Button>
      </div>
    </div>
  );
};
