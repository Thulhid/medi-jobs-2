"use client";

import { useState } from "react";
import type { CreateNewsData } from "../types/types";

export const useCreateNews = () => {
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNews = async (data: CreateNewsData) => {
    try {
      setNewsLoading(true);
      setError(null);
      
      const response = await fetch("/api/backend/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create news");
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

  return { createNews, newsLoading, error };
};