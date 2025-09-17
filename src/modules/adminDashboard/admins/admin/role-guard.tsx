"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const AdminRoleGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }
    
    if (status === "authenticated") {
      const role = session?.user?.role?.metaCode?.toUpperCase?.();
      const isRecruiter = role?.includes("RECRUITER");
      const isAdmin = role?.includes("ADMIN") || role?.includes("SUPER");
      
      if (isRecruiter) {
        router.replace("/recruiter-dashboard");
        return;
      }
      
      if (!isAdmin) {
        router.replace("/signin");
        return;
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="p-4 text-sm text-gray-500">Loading...</div>;
  }

  const role = session?.user?.role?.metaCode?.toUpperCase?.();

  const isAdmin = role?.includes("ADMIN") || role?.includes("SUPER");
  
  if (status === "authenticated" && isAdmin) {
    return <>{children}</>;
  }

  return null;
};
