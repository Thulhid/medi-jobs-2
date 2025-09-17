"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useGetAllNews } from "@/modules/backend/news/hooks/use-get-all-news";
import { useDeleteNews } from "@/modules/backend/news/hooks/use-delete-news";
import { LoadingSpinner } from "@/modules/shared/components/loading-spinner";
import { PageHeader } from "@/modules/shared/components/page-header";
import { SearchFilters } from "@/modules/shared/components/search-filters";
import NewsCard from "./news-card";
import type { News } from "@/modules/backend/news/types/types";



export const NewsList = () => {
  const { news, newsLoading, refetch } = useGetAllNews();
  const { deleteNews, newsLoading: deleteLoading } = useDeleteNews();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (news || [])
      .filter((n: News) =>
        category ? n.category === category : true,
      )
      .filter((n: News) =>
        !q
          ? true
          : n.title?.toLowerCase().includes(q) ||
            n.description?.toLowerCase().includes(q) ||
            n.category?.toLowerCase().includes(q),
      );
  }, [news, category, search,deleteLoading]);

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      try {
        await deleteNews(String(id));
        refetch();
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set((news || []).map((n: News) => n.category).filter(Boolean))
    );
    return uniqueCategories.map((cat) => ({ label: cat, value: cat }));
  }, [news]);



  return (
    <div className="space-y-6">
      <PageHeader
        title="NEWS MANAGEMENT"
        description="Manage news articles here."
        actions={
          <Link
            href="/admin-dashboard/news/add-new-news"
            className="px-4 py-2 bg-[#1e4a28] text-white hover:bg-[#007f4e] rounded-lg"
          >
            Add New Article
          </Link>
        }
      />

      <SearchFilters
        searchValue={search}
        onSearchChange={setSearch}
        onClearFilters={handleClearFilters}
        filters={
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        }
      />

      {newsLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((newsItem) => (
            <NewsCard
              key={newsItem.id}
              id={newsItem.id}
              title={newsItem.title}
              category={newsItem.category}
              description={newsItem.description}
              image={newsItem.image}
              createdAt={newsItem.createdAt}
              onDelete={() => handleDelete(newsItem.id)}
            />
          ))}
        </div>
      )}

      {!newsLoading && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No news articles found</p>
        </div>
      )}
    </div>
  );
};