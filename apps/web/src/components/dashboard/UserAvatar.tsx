import React from 'react';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  onClick?: () => void;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, imageUrl, onClick, className = '' }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-indigo-100 rounded-full hover:ring-2 hover:ring-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-indigo-700">{initial}</span>
      )}
    </button>
  );
};
