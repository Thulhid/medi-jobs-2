"use client";

import { useState } from "react";

export const useDeleteNews = () => {
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNews = async (id: string) => {
    try {
      setNewsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/backend/news/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete news");
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setNewsLoading(false);
    }
  };

  return { deleteNews, newsLoading, error };
};