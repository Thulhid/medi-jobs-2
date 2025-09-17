import type { Metadata } from "next";
import React from "react";
import "@/app/globals.css";
import "antd/dist/reset.css";
import { Providers } from "@/modules/shared/components/providers";
import RecruiterSidebar from "@/modules/recruiterDashboard/components/sidebar";

export const metadata: Metadata = {
  title: "Recruiter | Medi Jobs",
};

export default function RecruiterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Providers>
        <body className="antialiased" suppressHydrationWarning={true}>
          <div className="min-h-screen flex">
            <RecruiterSidebar />
            <main className="flex-1">
              <div className="p-4 w-full max-w-[1440px] mx-auto">{children}</div>
            </main>
          </div>
        </body>
      </Providers>
    </html>
  );
}
