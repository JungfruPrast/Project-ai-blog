import React from 'react'
import { client } from "@/sanity/lib/client";
import Header from '@/app/components/Header';
import { SEO } from '@/app/utils.tsx/Interface';
import Link from 'next/link';

//set the display of content to latest published
async function getSEO() {
  const query = `
  *[_type == "seo"] | order(publishedAt desc) {
    title,
    slug,
    publishedAt,
    excerpt,
    tags[]-> {
      _id,
      slug,
      name
    }}
  `;
  const data = await client.fetch(query);
  return data;
  }

  export const revalidate = 600;

  export default async function Home() {
    const posts: SEO[] = await getSEO();
    console.log(posts, "posts");
  
    return (
      <div>
        <Header title="SEO Documents" tags/>
        <div>
          {posts?.length > 0 &&
            posts?.map((post) => <PostComponent key={post?._id} post={post} />)}
        </div>
      </div>
    );
  }

  interface Props {
    post: SEO;
}

const PostComponent = ({post}: Props) => {
  return (
    <div className={cardStyle}>
        <Link href={`/seodocuments/${post?.slug?.current}`}>
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