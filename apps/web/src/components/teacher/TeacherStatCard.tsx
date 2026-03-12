import React from 'react';

interface TeacherStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  colorClass: string;
  bgColorClass: string;
}

export const TeacherStatCard: React.FC<TeacherStatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  colorClass, 
  bgColorClass 
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className={`text-3xl font-bold ${colorClass}`}>{value}</h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColorClass} ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};
