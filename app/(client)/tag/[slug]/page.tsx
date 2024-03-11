import Header from "@/app/components/Header";
import PostComponent from "@/app/components/PostComponent";
import { client } from "@/sanity/lib/client";
import { SEO } from "@/sanity/schemas/SEO";
import React from "react";
import { Document } from "@/app/components/PostComponent";

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
  const posts: Array<Document> = await getPostsAndSEOByTag(params.slug);
  console.log(posts, SEO, "posts by tag");
  return (
    <div>
      <Header title={`${params?.slug}`} tags />
      <div>
        {posts?.length > 0 && posts?.map((post) => (
          <PostComponent key={post?._id} document={post} />
        ))}
      </div>
    </div>
  );
};

export default page;