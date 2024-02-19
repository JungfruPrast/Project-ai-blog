'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import ThemesSwitch from './ThemesSwitch';

// Define the interface for the page data
interface Page {
  title: string;
  slug: string;
}

const Navbar = () => {
  // State to hold the pages data
  const [pages, setPages] = useState<Page[]>([]);

  // Fetch pages data from Sanity on component mount
  useEffect(() => {
    const query = '*[_type == "page"]{title, "slug": slug.current}';
    client.fetch(query).then((data) => {
      setPages(data as Page[]);
    });
  }, []);

  return (
    <div className='sticky top-0 z-50 bg-inherit shadow dark:shadow-gray-600 w-full'>
      <div className='flex justify-between items-center h-16 px-6 mx-auto max-w-6xl w-full'>
        <Link href='/' passHref>
          <div className='text-2xl font-bold'>Project AI Blog</div>
        </Link>

        {/* Dynamically generate links for pages */}
        <div className='flex items-center space-x-7 font-semibold text-lg'>
          {pages.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`} passHref>
              <div>{page.title}</div>
            </Link>
          ))}
          
            <ThemesSwitch />
          
        </div>
        
      </div>
    </div>
  );
};

export default Navbar;