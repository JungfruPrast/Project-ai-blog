import Link from 'next/link';
import React from 'react'

interface Props {
    title: string,
    tags?: boolean;
}

const Header = ({title = "", tags = false}: Props) => {
  return (
    <header className='py-14 px-4 mb-12 text-center border-b dark:border-gray-600'>
        <h1 className='uppercase text-3xl mx-auto max-w-2xl font-bold'>{title}</h1>
        {tags && (
          <div className='inline-block text-sm font-semibold mt-2 rounded-full bg-black text-white px-2 py-2 dark:bg-white dark:text-black'>
            <Link href="/tag">Sort by tags</Link>
          </div>
        )}
    </header>
  )
}

export default Header
