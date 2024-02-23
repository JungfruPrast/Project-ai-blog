'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
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

  useEffect(() => {
    const fetchPages = async () => {
      const query = '*[_type == "page"]{title, "slug": slug.current}';
      client.fetch(query).then((data) => setPages(data as Page[]));
    };
    fetchPages();
  }, []);

  useEffect(() => {
    const fetchSeoDocuments = async () => {
      const query = '*[_type == "seo"] | order(publishedAt asc) {title, "slug": slug.current}';
      client.fetch(query).then((documents) => setSeoDocuments(documents as SEODocument[]));
    };
    fetchSeoDocuments();
  }, []);

  return (
    <nav className='sticky top-0 z-50 bg-inherit shadow dark:shadow-gray-600 w-full'>
      <div className='flex justify-between items-center h-16 px-6 mx-auto max-w-6xl'>
        <Link href='/' passHref>
          <div className='text-2xl font-bold'>Project AI Blog</div>
        </Link>

        {/* Burger Icon for Mobile */}
        <div className='md:hidden items-center space-x-3 font-semibold text-sm'>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {/* SVG for burger icon */}
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          <ThemesSwitch/>
        </div>

        {/* Links for Desktop, hidden on Mobile */}
        <div className={`hidden md:flex items-center space-x-7 font-semibold text-md ${isMobileMenuOpen ? 'hidden' : ''}`}>
          {pages.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`} passHref>
              <div>{page.title}</div>
            </Link>
          ))}
          
          {/* SEO Documents Dropdown for Desktop */}
          <div className='relative'>
            <button onClick={() => setIsSEODropdownOpen(!isSEODropdownOpen)} className='flex items-center px-3 py-2'>
              SEO Docs
              {isSEODropdownOpen ? <DownwardToggleIcon /> : <RightSideToggleIcon />}
            </button>
            {isSEODropdownOpen && (
              <div className='absolute mt-2 py-2 w-48 bg-white shadow-md rounded-md dark:bg-black dark:shadow-gray-800 right-0 z-10'>
                {seoDocuments.map((doc) => (
                  <Link key={doc.slug} href={`/seodocuments/${doc.slug}`} passHref>
                    <div className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800'>{doc.title}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <ThemesSwitch />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden absolute top-full left-0 z-40 w-full bg-white dark:bg-black shadow-md p-4 dark:shadow-gray-800'>
            {pages.map((page) => (
              <Link key={page.slug} href={`/${page.slug}`} passHref>
                <div className='block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800'>{page.title}</div>
              </Link>
            ))}
            {/* Option to toggle SEO Docs in Mobile Menu */}
            <button onClick={() => setIsSEODropdownOpen(!isSEODropdownOpen)} className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center'>
              SEO Docs
              {isSEODropdownOpen ? <DownwardToggleIcon /> : <RightSideToggleIcon />}
            </button>
            {isSEODropdownOpen && seoDocuments.map((doc) => (
              <Link key={doc.slug} href={`/seodocuments/${doc.slug}`} passHref>
                <div className='block pl-8 pr-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-zinc-800'>{doc.title}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

// SVG components for the toggle icons
const RightSideToggleIcon = () => (
  <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M10.25 22.987l7.99-9c.51-.57.76-1.28.76-1.99s-.25-1.42-.74-1.98c-.01 0-.01-.01-.01-.01l-.02-.02-7.98-8.98c-1.1-1.24-3.002-1.35-4.242-.25-1.24 1.1-1.35 3-.25 4.23l6.23 7.01-6.23 7.01c-1.1 1.24-.99 3.13.25 4.24 1.24 1.1 3.13.98 4.24-.26z"/>
  </svg>
);

const DownwardToggleIcon = () => (
  <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M22.987 10.25l-9 7.99c-.57.51-1.28.76-1.99.76s-1.42-.25-1.98-.74c0-.01-.01-.01-.01-.01l-.02-.02-8.98-7.98c-1.24-1.1-1.35-3.002-.25-4.242 1.1-1.24 3-1.35 4.23-.25l7.01 6.23 7.01-6.23c1.24-1.1 3.13-.99 4.24.25 1.1 1.24.98 3.13-.26 4.24z"/>
  </svg>
);

export default Navbar;
