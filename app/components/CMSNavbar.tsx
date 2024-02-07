import React from 'react'
import Link from 'next/link'

const CMSNavbar = () => {
  return (
    <div className='flex justify-between py-2 px-5'>
        <Link href='/'>
        <div className='text-3xl'>Project <span className='text-purple-500'>AI Blog</span></div>
        </Link>
    </div>
  )
}

export default CMSNavbar