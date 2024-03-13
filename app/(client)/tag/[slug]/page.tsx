import Header from "@/app/components/Header";
import PostComponent from "@/app/components/PostComponent";
import { client } from "@/sanity/lib/client";
import { SEO } from "@/sanity/schemas/SEO";
import React from "react";
import { Post } from "@/app/utils.tsx/Interface";
import { notFound } from "next/navigation";

async function getPostsAndSEOByTag(tag: string) {
  const query = `
  *[_type in ["post", "seo"] && references(*[_type == "tag" && slug.current == "${tag}"]._id)]{
    _type,
    title,
    slug,
    publishedAt,
    excerpt,
    tags[]-> {
      _id,
      slug,
      name
    }
  }
  `;

  const posts = await client.fetch(query);
  return posts;
}

export const revalidate = 3600;

interface Params {
  params: {
    slug: string;
  };
}

const page = async ({ params }: Params) => {
  const posts: Array<Post> = await getPostsAndSEOByTag(params.slug);
  console.log(posts, SEO, "posts by tag");
    if (!posts) {
      notFound()
    }
  return (
    <div>
      <Header title={`${params?.slug}`} tags />
      <div>
        {posts?.length > 0 && posts?.map((post) => (
          <PostComponent key={post?._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default page;