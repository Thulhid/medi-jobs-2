import { useState } from "react";

type CreateAdminPayload = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  mobile?: string;
};

export function useCreateAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAdmin = async (payload: CreateAdminPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/backend/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(
          j?.error || `Failed to create admin (status ${res.status})`,
        );
      }
      return await res.json();
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to create admin");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createAdmin, loading, error };
}
