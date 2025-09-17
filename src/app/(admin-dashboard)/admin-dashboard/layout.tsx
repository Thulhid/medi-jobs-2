import type { Metadata } from "next";
import React from "react";
import "@/app/globals.css";
import "antd/dist/reset.css";
import { Providers } from "@/modules/shared/components/providers";
import { Sidebar } from "@/modules/adminDashboard/admins/admin/_components/sidebar";

export const metadata: Metadata = {
  title: "Medi Jobs-Admin Dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Providers>
        <body className="antialiased" suppressHydrationWarning={true}>
          <div className=" min-h-screen flex">
            <Sidebar />
            <main className="flex-1">
              <div className="p-4 w-full max-w-[1440px] mx-auto">{children}</div>
            </main>
          </div>
        </body>
      </Providers>
    </html>
  );
}
