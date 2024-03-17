import React from 'react';
import Navbar from "../components/Navbar";
import Provider from '../utils.tsx/Provider';
import "./globals.css"; // Ensure Tailwind CSS is imported here
import { Inter } from "next/font/google";
import { Metadata } from 'next';
import Footer from '../components/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { headers } from 'next/headers';
import Script from 'next/script';
import CookieConsentComponent from '../components/CookieConsent';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://project-ai-blog.vercel.app/'),
  title: "My AI Blogging Journey",
  description: "Follow me as I document my practices of AI content creation following SEO best practices with the goal of getting monetized",
  robots: {
    index: true, // or false to prevent this page from being indexed
    follow: true, // or false to instruct bots not to follow links from this page
  // Additional directives can be included as needed:
    noarchive: false, // Use true to prevent cached copies of this page from being available
    nosnippet: false, // Use true to prevent a text snippet or video preview from being shown in search results
    notranslate: false, // Use true to prevent translation of this page in search results
    noimageindex: false, // Use true to prevent images on this page from being indexed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const nonce = headers().get('x-nonce') || ""

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white text-black dark:bg-black dark:text-white dark:selection:bg-purple-700`}>
        <Provider nonce={nonce}>
          <CookieConsentComponent/>
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