import React from 'react';

interface RoleSelectorProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ data, updateData, onNext }) => {
  const handleSelectRole = (role: 'student' | 'teacher') => {
    updateData({ role });
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Choose your role</h2>
        <p className="text-gray-500 mt-2">How will you be using StudyRadar?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Student Card */}
        <button
          type="button"
          onClick={() => handleSelectRole('student')}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-200 ${
            data.role === 'student'
              ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.02]'
              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Student</h3>
          <p className="text-sm text-gray-500 text-center">
            Find resources, notes, and prepare for your exams efficiently.
          </p>
        </button>

        {/* Teacher Card */}
        <button
          type="button"
          onClick={() => handleSelectRole('teacher')}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-200 ${
            data.role === 'teacher'
              ? 'border-emerald-600 bg-emerald-50 shadow-md transform scale-[1.02]'
              : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Teacher</h3>
          <p className="text-sm text-gray-500 text-center">
            Upload materials, guide students, and manage your subjects.
          </p>
        </button>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={!data.role}
          className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
            data.role
              ? data.role === 'student'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next Step
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
