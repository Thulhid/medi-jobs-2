"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/modules/shared/components/loading-spinner";

export const Demo = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold mb-2">Demo</h1>
      <p className="text-gray-600">Demo content coming soon.</p>
    </main>
  );
};
