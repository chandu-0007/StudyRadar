"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RoleSelector } from './RoleSelector';
import { CollegeDetailsForm } from './CollegeDetailsForm';
import { AccountDetailsForm } from './AccountDetailsForm';
import { ProfileDetailsForm } from './ProfileDetailsForm';

export const SignupStepper = () => {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    role: '', // 'student' or 'teacher'
    college: '',
    department: '',
    semester: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    graduationYear: '',
    linkedin: '',
    github: '',
    bio: '',
    profileImage: '',
  });

  const updateFormData = (newData: any) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    setApiError('');

    try {
      // Clean up payload before sending
      const payload = {
        role: formData.role.toUpperCase(),
        college: formData.college,
        department: formData.department.toUpperCase(),
        currentSem: formData.role === 'student' ? formData.semester : 'SEM1',
        username: formData.username,
        email: formData.email,
        password: formData.password,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : new Date().getFullYear(),
        linkedin: formData.linkedin || undefined,
        github: formData.github || undefined,
        bio: formData.bio || undefined,
      };

      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed. Please check your data.');
      }

      if (data.token && data.user) {
        // Technically signup backend logic doesn't return a token right now,
        // but if it ever does, this handles it.
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        // Since no token is provided after signup in the current backend API, 
        // cleanly push them back to the login screen to perform a real authentication!
        router.push('/login');
      }
    } catch (err: any) {
      setApiError(err.message || 'An error occurred during signup.');
      setIsLoading(false);
    }
  };

  const steps = [
    'Role',
    'Academics',
    'Account',
    'Profile'
  ];

  return (
    <div className="w-full max-w-lg">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0">
             <div 
               className="h-full rounded-full transition-all duration-300" 
               style={{ 
                 width: `${((step - 1) / (steps.length - 1)) * 100}%`,
                 backgroundColor: formData.role === 'teacher' ? '#059669' : '#4f46e5' // emerald-600 or indigo-600
               }} 
             />
          </div>
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = step === stepNumber;
            const isCompleted = step > stepNumber;
            const themeColor = formData.role === 'teacher' ? 'bg-emerald-600' : 'bg-indigo-600';
            const themeBorder = formData.role === 'teacher' ? 'border-emerald-600 text-emerald-600' : 'border-indigo-600 text-indigo-600';
            
            return (
              <div key={label} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                    ${isCompleted ? `${themeColor} text-white` : isActive ? `bg-white border-2 ${themeBorder}` : 'bg-white border-2 border-gray-300 text-gray-400'}
                  `}
                >
                  {stepNumber}
                </div>
                <span className={`text-xs font-medium absolute -bottom-6 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
          {apiError}
        </div>
      )}

      {/* Form Area */}
      <div className="min-h-[350px]">
        {step === 1 && (
          <RoleSelector 
            data={formData} 
            updateData={updateFormData} 
            onNext={handleNext} 
          />
        )}
        
        {step === 2 && (
          <CollegeDetailsForm 
            data={formData} 
            updateData={updateFormData} 
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <AccountDetailsForm 
            data={formData} 
            updateData={updateFormData} 
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 4 && (
          <ProfileDetailsForm 
            data={formData} 
            updateData={updateFormData} 
            onSubmit={handleSubmit}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Footer Link */}
      {step === 1 && (
        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <button 
            onClick={() => router.push('/login')}
            className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Log in here
          </button>
        </p>
      )}
    </div>
  );
};
