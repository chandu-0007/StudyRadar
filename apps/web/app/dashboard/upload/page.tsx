"use client";

import React from 'react';
import { UploadForm } from '../../../src/components/resources/UploadForm';

export default function UploadPage() {
  return (
    <div className="w-full">
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Upload Resource</h1>
        <p className="text-gray-500 mt-2">Share your notes, presentations, or past papers to help other students.</p>
      </div>
      
      <UploadForm />
    </div>
  );
}
