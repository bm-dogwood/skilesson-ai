import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import RootLayoutShell from "@/components/RootLayoutShell";
import { Providers } from "./provider";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkiLesson.ai — Master the Mountain Before You Hit the Slopes",
  description:
    "The ultimate online platform for learning to ski and snowboard. World-class video lessons, AI coaching, and progress tracking — from your living room to the summit. For youth through adult, families, and all skill levels.",
  keywords: [
    "ski lessons online",
    "snowboard lessons",
    "learn to ski",
    "ski instruction",
    "snowboard instruction",
    "virtual ski school",
    "AI ski coach",
    "ski training",
    "snowboard training",
  ],
  openGraph: {
    title: "SkiLesson.ai — Master the Mountain Before You Hit the Slopes",
    description:
      "World-class ski and snowboard lessons. Learn from Olympians and certified pros, track your progress, and hit the slopes with confidence.",
    type: "website",
    url: "https://skilesson.ai",
    siteName: "SkiLesson.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkiLesson.ai — Master the Mountain",
    description:
      "The ultimate online platform for learning to ski and snowboard. From your living room to the summit.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <LanguageProvider>
          <Providers>
            {" "}
            <RootLayoutShell>{children}</RootLayoutShell>{" "}
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
