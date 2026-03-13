"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../../../src/context/UserContext";
import { ResourceCard, ResourceItem } from "../../../src/components/resources/ResourceCard";
import { Loader2, Files, Trash2 } from "lucide-react";

export default function MyUploadsPage() {
  const { user } = useUser();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyResources = useCallback(async () => {
    try {
      if (!user) return;
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const apiBase = process.env.NEXT_PUBLIC_API || "http://localhost:5000";

      const response = await fetch(`${apiBase}/api/resources?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch uploads");
      }

      const allRes = data.resources || data.data || [];
      const mine = allRes.filter(
        (r: ResourceItem) => r.uploadedBy?.username === user.username
      );
      setResources(mine);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyResources();
  }, [fetchMyResources]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this resource?")) return;

    try {
      const token = localStorage.getItem("token");
      const apiBase = process.env.NEXT_PUBLIC_API || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/resources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setResources((prev) => prev.filter((r) => r.id !== id));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete resource");
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const apiBase = process.env.NEXT_PUBLIC_API || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/resources/${id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.fileUrl) {
        window.open(data.fileUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center gap-3 relative">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl absolute -left-16 hidden md:flex">
          <Files className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">My Uploads</h1>
          <p className="text-gray-500 mt-2">
            Review and manage the resources you have uploaded to the platform.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded-xl mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white border text-center py-24 rounded-2xl border-dashed border-gray-300">
          <p className="text-gray-500 font-medium mb-2">
            You haven't uploaded any resources yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="relative group">
              <ResourceCard
                resource={resource}
                role={user.role || "STUDENT"}
                onDownload={handleDownload}
              />
              <button
                onClick={() => handleDelete(resource.id)}
                className="absolute top-4 left-4 p-1.5 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 z-10 shadow-sm"
                title="Delete Resource"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

