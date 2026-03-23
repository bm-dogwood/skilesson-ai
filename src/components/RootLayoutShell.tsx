"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBareless =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/admin");

  if (isBareless) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="snow-container" aria-hidden="true">
        <div className="snowflake" />
        <div className="snowflake" />
        <div className="snowflake" />
        <div className="snowflake" />
        <div className="snowflake" />
        <div className="snowflake" />
        <div className="snowflake" />
        <div className="snowflake" />
        <div className="snowflake" />
        <div className="snowflake" />
      </div>
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </>
  );
}
