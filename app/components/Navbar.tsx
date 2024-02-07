import React from 'react';
import Link from 'next/link';
import ThemesSwitch from './ThemesSwitch';

const Navbar = () => {
  return (
    // This div extends across the full width of the viewport
    <div className='sticky top-0 z-50 bg-inherit shadow dark:shadow-gray-600 w-full'>
        {/* This inner div centers the navbar content and limits its width */}
        <div className='flex justify-between items-center h-16 px-6 mx-auto max-w-5xl w-full'>
            <Link href='/'>
                <div className='text-3xl font-bold'>Project AI Blog</div>
            </Link>
            <ThemesSwitch />
        </div>
    </div>
  );
}

export default Navbar;