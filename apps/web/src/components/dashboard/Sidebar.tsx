"use client";

import React from 'react';
import { 
  Home, 
  Compass, 
  BookOpen, 
  UploadCloud, 
  Files, 
  Bookmark, 
  User 
} from 'lucide-react';
import { SidebarSection } from './SidebarSection';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  role: 'STUDENT' | 'TEACHER';
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm overflow-y-auto z-30 sticky top-16">
      <div className="py-6 px-3">
        <SidebarSection title="Main">
          <SidebarItem href="/dashboard" label="Dashboard" icon={Home} />
          {role === 'STUDENT' && (
            <>
              <SidebarItem href="/dashboard/explore" label="Explore Resources" icon={Compass} />
              <SidebarItem href="/dashboard/subjects" label="Subjects" icon={BookOpen} />
            </>
          )}
          {role === 'TEACHER' && (
            <SidebarItem href="/dashboard/subjects" label="Subjects" icon={BookOpen} />
          )}
        </SidebarSection>

        <SidebarSection title="Contribute">
          <SidebarItem href="/dashboard/upload" label="Upload Resource" icon={UploadCloud} />
          {role === 'STUDENT' ? (
            <SidebarItem href="/dashboard/my-uploads" label="My Uploads" icon={Files} />
          ) : (
            <SidebarItem href="/dashboard/my-resources" label="My Resources" icon={Files} />
          )}
        </SidebarSection>

        <SidebarSection title="Personal">
          {role === 'STUDENT' && (
            <SidebarItem href="/dashboard/bookmarks" label="Bookmarks" icon={Bookmark} />
          )}
          <SidebarItem href="/dashboard/profile" label="Profile" icon={User} />
        </SidebarSection>
      </div>
    </aside>
  );
};
