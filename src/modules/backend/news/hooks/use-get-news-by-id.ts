"use client";

import { useState, useEffect } from "react";
import type { News } from "../types/types";

export const useGetNewsById = (id: string) => {
  const [news, setNews] = useState<News | null>(null);
  const [newsLoading, setNewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      const response = await fetch(`/api/backend/news/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();
      setNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNews();
    }
  }, [id]);

  return { news, newsLoading, error, refetch: fetchNews };
};