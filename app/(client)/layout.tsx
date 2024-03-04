import React from 'react';
import Navbar from "../components/Navbar";
import Provider from '../utils.tsx/Provider';
import "./globals.css"; // Ensure Tailwind CSS is imported here
import { Inter } from "next/font/google";
import { Metadata } from 'next';
import Footer from '../components/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleTagManager } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://project-ai-blog.vercel.app/'),
  title: "My AI Blogging Journey",
  description: "Follow me as I document my practices of AI content creation following SEO best practices with the goal of getting monetized",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white text-black dark:bg-black dark:text-white dark:selection:bg-purple-700`}>
        <GoogleTagManager gtmId='GTM-WCXLPWX5'/>
        <Provider>
          <Navbar />
          {/* Adjust padding and max-width responsively for smaller screens */}
          <main className="flex-grow mx-auto p-4 sm:px-6 lg:px-8 max-w-6xl lg w-full">
            {children}
            <SpeedInsights/>
          </main>
          <Footer/>
        </Provider>
      </body>
    </html>
  );
}