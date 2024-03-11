import Link from 'next/link';
import React from 'react';

interface Tag {
  _id: string;
  name: string;
  slug: { current: string; };
}

export interface Document {
  _type: 'post' | 'seodocuments';  // Ensure this matches your document types in Sanity
  title: string;
    slug: {current: string};
    publishedAt: string;
    updatedAt: string;
    excerpt: string;
    body: any;
    tags: Array<Tag>;
    _id: string;
}

// Define the Props interface expected by PostComponent
interface Props {
  document: Document;
}

const PostComponent = ({ document }: Props) => {
  // Determine the path based on the document type
  const path = document._type === 'post' ? 'posts' : 'seodocuments';

  return (
    <div className={cardStyle}>
        <Link href={`/${path}/${document.slug.current}`}>
            <h2 className='text-2xl font-bold dark:text-slate-100 cursor-pointer'>{document.title}</h2>
        </Link>
        <p className='my-2 font-semibold'>{new Date(document.publishedAt).toDateString()}</p>
        <p className='dark:text-gray-200 mb-4 line-clamp-2'>{document.excerpt}</p>

        {/*TAGS*/}
        <div>
        {document.tags.map((tag) => (
          <span key={tag._id} 
            className='mr-2 p-1 rounded-full 
            text-sm lowercase 
            dark:bg-gray-950 border 
            dark:border-gray-900 cursor-pointer'>
              #{tag.name}</span>
        ))}
      </div>
    </div>
  )
}

export default PostComponent;

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
`;
