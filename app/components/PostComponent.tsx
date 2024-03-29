import Link from 'next/link'
import React from 'react'
import { Post } from '../utils.tsx/Interface';
import Image from 'next/image';

//added basepathoverride to specify routing as the other mechanism only works when the presence of more than 1 source of data is being fetched. e.g., _type["seo"] && ["posts"], see tag/[slug] for example. 
interface Props {
    post: Post;
    basePathOverride?: string;
}

const PostComponent = ({post}: Props) => {
  const basePath = post._type == 'post' ? '/posts' : '/seodocuments';
   const imageUrl = post?.featuredImage?.url; // Directly accessing 'url'
    const imageAlt = post?.featuredImage?.alt;

    return (
      <div className={`${cardStyle} flex flex-col md:flex-row items-start space-x-4`}> {/* Use flex-col for vertical layout on mobile */}
        {imageUrl && (
          <div className="flex-none w-full md:w-48 h-48 relative mb-4 md:mb-0"> {/* Ensure full width on mobile */}
            <Image
              src={imageUrl}
              alt={imageAlt || 'Featured Image'}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        )}
        <div className="flex-grow"> {/* This div wraps the text and tags */}
          <Link href={`${basePath}/${post?.slug?.current}`}>
            
              <h2 className='text-2xl font-bold dark:text-slate-100'>{post?.title}</h2>
              <p className='my-2 font-semibold'>{new Date(post?.publishedAt).toDateString()}</p>
              <p className='dark:text-gray-200 mb-4 line-clamp-2'>{post?.excerpt}</p>
            
          </Link>
          {/* Tags div now moved here to be part of the main flow */}
          <div className="mt-2"> {/* Added margin-top for spacing */}
            {post?.tags?.map((tag) => (
              <span key={tag?._id} 
                className='inline-block mr-2 mb-2 p-1 rounded-full text-sm lowercase dark:bg-gray-950 border dark:border-gray-900'>
                  #{tag?.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };



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