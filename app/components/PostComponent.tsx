import Link from 'next/link'
import React from 'react'
import { Post } from '../utils.tsx/Interface'

interface Props {
    post: Post;
}

const PostComponent = ({post}: Props) => {
  return (
    <div className={cardStyle}>
        <Link href={`/posts/${post?.slug?.current}`}>
            <h2 className='text-2xl font-bold dark:text-slate-100'>{post?.title}</h2>
            <p className='my-2 font-semibold'>{new Date(post?.publishedAt).toDateString()}</p>
            <p className='dark:text-gray-200 mb-4 line-clamp-2'>{post?.excerpt}</p>
        </Link>

        {/*TAGS*/}
        <div>
        {post?.tags?.map((tag) => (
          <span key={tag?._id} 
            className='mr-2 p-1 rounded-full 
            text-sm lowercase 
            dark:bg-gray-950 border 
            dark:border-gray-900'>
              #{tag?.name}</span>
        ))}
      </div>
    </div>
  )
}


export default PostComponent

const cardStyle = `
max-w-6xl
mb-8 
p-4
border
border-gray-900
rounded-md
shadow-md
shadow-gray-600
hover:bg-gray-950
hover:text-white
hover:dark:bg-zinc-900
`