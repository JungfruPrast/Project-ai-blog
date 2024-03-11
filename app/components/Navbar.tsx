'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ThemesSwitch from './ThemesSwitch';

interface Page {
  title: string;
  slug: string;
}

interface SEODocument {
  title: string;
  slug: string;
}

const Navbar = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [seoDocuments, setSeoDocuments] = useState<SEODocument[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSEODropdownOpen, setIsSEODropdownOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);
  const toggleSEODropdown = useCallback(() => setIsSEODropdownOpen(prev => !prev), []);

  // Effect for logging mount and unmount
  useEffect(() => {
    console.log('Navbar component mounted');

    return () => {
      console.log('Navbar component unmounted');
    };
  }, []);

  useEffect(() => {
    // Async function to fetch SEO Documents
    const fetchSeoDocuments = async () => {
      // Provide a fallback to localhost if NEXT_PUBLIC_BASE_URL is not defined
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const apiUrl = `${baseUrl}/api/routes`; // Ensure this endpoint matches your API route

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch SEO links titles from ${apiUrl}`);
        }
        const documents = await response.json();
        setSeoDocuments(documents); // Update state with fetched documents
      } catch (error) {
        console.error('Error fetching SEO documents:', error);
      }
    };

    // Call the fetch function
    fetchSeoDocuments();
  }, []); // Dependencies array left empty to ensure this runs once on mount

  return (
    <nav className='sticky top-0 z-50 bg-inherit shadow dark:shadow-gray-600 w-full'>
      <div className='flex justify-between items-center h-16 px-6 mx-auto max-w-6xl'>
        <Link href='/' passHref>
          <div className='text-2xl font-bold'>Project AI Blog</div>
        </Link>

        {/* Burger Icon for Mobile */}
        <div className='md:hidden flex items-center space-x-3 font-semibold text-sm'>
          <button onClick={toggleMobileMenu} aria-label="Open menu">
            {/* SVG for burger icon */}
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          <ThemesSwitch />
        </div>

        {/* Links for Desktop, hidden on Mobile */}
        <div className={`hidden md:flex items-center space-x-7 font-semibold text-md ${isMobileMenuOpen ? 'hidden' : ''}`}>
          
            <Link href={`/about`} passHref>
              <div>About</div>
            </Link>
         
          {/* SEO Documents Dropdown for Desktop */}
          <div className='relative'>
            <button onClick={toggleSEODropdown} aria-label="Open SEO Docs" className='flex items-center px-3 py-2'>
              SEO Docs
              {isSEODropdownOpen ? <DownwardToggleIcon /> : <RightSideToggleIcon />}
            </button>
            {isSEODropdownOpen && (
              <div className='absolute mt-2 py-2 w-48 bg-white shadow-md rounded-md dark:bg-black dark:shadow-gray-800 right-0 z-10'>
                {seoDocuments.map((doc) => ( // Only take the first 5 documents - redacted
                  <Link key={doc.slug} href={`/seodocuments/${doc.slug}`} passHref>
                    <div className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800'>{doc.title}</div>
                  </Link>
              ))}
                <Link href="/seodocuments" passHref>
                  <div className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800'>View All</div>
                </Link>
              </div>
            )}
          </div>
          <ThemesSwitch />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden absolute top-full left-0 z-40 w-full bg-white dark:bg-black shadow-md p-4 dark:shadow-gray-800'>
            <Link href={`/about`} passHref>
              <div>About</div>
            </Link>
            <button onClick={toggleSEODropdown} className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center'>
              SEO Docs
              {isSEODropdownOpen ? <DownwardToggleIcon /> : <RightSideToggleIcon />}
            </button>
            {isSEODropdownOpen && seoDocuments.map((doc) => (
              <Link key={doc.slug} href={`/seodocuments/${doc.slug}`} passHref>
               <div className='block pl-8 pr-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-zinc-800'>{doc.title}</div>
              </Link>
          ))}
              <Link href="/seodocuments" passHref>
              <div className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800'>View All</div>
              </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

const RightSideToggleIcon = () => (
  <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M10.25 22.987l7.99-9c.51-.57.76-1.28.76-1.99s-.25-1.42-.74-1.98c-.01 0-.01-.01-.01-.01l-.02-.02-7.98-8.98c-1.1-1.24-3.002-1.35-4.242-.25-1.24 1.1-1.35 3-.25 4.23l6.23 7.01-6.23 7.01c-1.1 1.24-.99 3.13.25 4.24 1.24 1.1 3.13.98 4.24-.26z"/>
  </svg>
);

// DownwardToggleIcon component for showing an arrow pointing downward
const DownwardToggleIcon = () => (
  <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M22.987 10.25l-9 7.99c-.57.51-1.28.76-1.99.76s-1.42-.25-1.98-.74c0-.01-.01-.01-.01-.01l-.02-.02-8.98-7.98c-1.24-1.1-1.35-3.002-.25-4.242 1.1-1.24 3-1.35 4.23-.25l7.01 6.23 7.01-6.23c1.24-1.1 3.13-.99 4.24.25 1.1 1.24.98 3.13-.26 4.24z"/>
  </svg>
);