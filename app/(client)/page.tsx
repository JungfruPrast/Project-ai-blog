import React from 'react'
import { client } from "@/sanity/lib/client";
import Header from '../components/Header';
//import { Post } from '../utils.tsx/Interface';
import PostComponent from '../components/PostComponent';
import { Document } from '../components/PostComponent';

//set the display of content to latest published
async function getPosts() {
  const query = `
  *[_type == "post"] | order(publishedAt desc) {
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
    const posts: Document[] = await getPosts();
    console.log(posts, "posts");
  
    return (
      <div>
        <Header title="Articles" tags/>
        <div>
          {posts?.length > 0 &&
            posts?.map((post) => <PostComponent key={post?._id} document={post} />)}
        </div>
      </div>
    );
  }