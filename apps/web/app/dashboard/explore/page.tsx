"use client";

import React from 'react';
import { ResourceFeed } from '../../../src/components/resources/ResourceFeed';

export default function ExplorePage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Explore Resources</h1>
        <p className="text-gray-500 mt-2">Discover study materials, notes, and past papers uploaded by your peers.</p>
      </div>
      
      <ResourceFeed />
    </div>
  );
}
