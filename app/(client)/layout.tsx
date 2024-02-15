import React from 'react';
import Navbar from "../components/Navbar";
import Provider from '../utils.tsx/Provider';
import "./globals.css"; // Ensure Tailwind CSS is imported here
import { Inter } from "next/font/google";
import { Metadata } from 'next';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
      <body className={`${inter.className} flex flex-col min-h-screen bg-amber-50 text-black dark:bg-black dark:text-amber-50 dark:selection:bg-purple-700`}>
        <Provider>
          <Navbar />
          {/* Adjust padding and max-width responsively for smaller screens */}
          <main className="flex-grow mx-auto p-4 sm:px-6 lg:px-8 max-w-4xl lg:max-w-5xl w-full">
            {children}
          </main>
          <Footer/>
        </Provider>
      </body>
    </html>
  );
}