import React from 'react'
import { client } from "@/sanity/lib/client";
import Header from '@/app/components/Header';
import PostComponent from '@/app/components/PostComponent';
import { SEO } from '@/app/utils.tsx/Interface';
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
