import Header from '@/app/components/Header';
import { Tag } from '@/app/utils.tsx/Interface';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import React from 'react';

async function getAllTags() {
  const query = `
  *[_type == "tag"] {
    name,
    slug,
    _id,
    "postCount": count(*[_type == "post" && references(^._id)]),
    "seoCount": count(*[_type == "seo" && references(^._id)])
  }`;
  const tags = await client.fetch(query);
  return tags;
}

export const revalidate = 600;

const Page = async () => {
  const tags: Tag[] = await getAllTags();
  console.log(tags, "tags");

  return (
    <div className='m-auto max-w-4xl p-4'>
      <Header title="Tags"/>
      <div>
        {tags?.length > 0 && tags.map((tag) => {
          // Skip rendering if slug or slug.current is not available
          if (!tag.slug?.current) {
            return null;
          }

          return (
            <Link key={tag._id} href={`/tag/${tag.slug.current}`} passHref>
              <div className="cursor-pointer block mb-8 p-4 border border-gray-900 rounded-md shadow-md shadow-gray-600 hover:bg-gray-950 hover:text-white dark:hover:bg-zinc-900 transition-colors">
              {tag.name} (
              {tag.postCount ?? 0 > 0 ? `${tag.postCount}` : ''}
              {tag.seoCount ?? 0 > 0 ? `${tag.seoCount}` : ''})
            </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
