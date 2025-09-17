"use client";

import { useState } from "react";
import type { UpdateNewsData } from "../types/types";

export const useUpdateNews = () => {
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateNews = async (id: string, data: UpdateNewsData) => {
    try {
      setNewsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/backend/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update news");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setNewsLoading(false);
    }
  };

  return { updateNews, newsLoading, error };
};