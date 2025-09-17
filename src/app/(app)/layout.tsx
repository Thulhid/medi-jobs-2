import type { Metadata } from "next";
import "../globals.css";
import React from "react";
import { Navbar } from "@/modules/navbar/components/navbar";
import { Footer}  from "@/modules/footer/component/footer";

export const metadata: Metadata = {
  title: "Medi Jobs",
  description: "Admin and Recruiter Dashboards",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`} suppressHydrationWarning={true}>
        <Navbar />
        <div>{children}</div>
        <Footer/>
      </body>
    </html>
  );
}
