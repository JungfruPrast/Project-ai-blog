import Header from '@/app/components/Header';
import { Tag } from '@/app/utils.tsx/Interface';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import React from 'react'

async function getAllTags() {
  const query = `
  *[_type == "tag"] {
    name,
    slug,
    _id,
    "postCount": count(*[_type == "post" && references("tags",^.id)])
  }
  `;
  const tags = client.fetch(query);
  return tags;
}

export const revalidate = 60;

const page = async () => {
  const tags: Tag[] = await getAllTags()
  console.log(tags, "tags")
  return (
    <div>
      <Header title="Tags"/>
      <div>
        {tags?.length > 0 && tags?.map((tag) => (
          <Link key={tag?._id} href={`/tag/${tag.slug.current}`}>
          <div className={cardStyle}>
            {tag.name} ({tag?.postCount})
          </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default page

const cardStyle = `
mb-4 
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