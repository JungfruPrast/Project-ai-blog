import Header from '@/app/components/Header'
import { Post } from '@/app/utils.tsx/Interface';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { PortableText, PortableTextProps } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Metadata } from 'next';
import { ResolvingMetadata } from 'next';
import TableOfContents from '@/app/components/ToC';
import { extractAndNestHeadingsFromBody } from '@/app/components/ToC';
import { notFound } from 'next/navigation';
import CopyToClipboard from '@/app/components/CopytoClipboard';
import { fetchDataWithLock } from '@/app/utils.tsx/cache';
import ResponsiveSidebarWrapper from '@/app/components/ResponsiveSideBar';
import { headers } from 'next/headers';
import Script from 'next/script';
import TextToSpeechButton from '@/app/components/TextToSpeechButton';
import ImageEnlargeOverlay from '@/app/components/LargeImageViewer';
import Refractor from 'react-refractor';
import js from 'refractor/lang/javascript';
import tsx from 'refractor/lang/tsx';
import typescript from 'refractor/lang/typescript'


Refractor.registerLanguage(js);
Refractor.registerLanguage(tsx);
Refractor.registerLanguage(typescript);

//defining the parameters of the query function
interface Params {
    params: {
        slug: string; 
    };
    searchParams: {[key: string]: string | string[] | undefined};
}
//Tells vercel to pre-render the route of this page on the server before serving it as a static html
//export async function generateStaticParams() {
  //const allPosts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  //return allPosts.map((post: Post) => ({
    //params: { slug: post.slug },
  //}));
//}

async function getPost(slug: string) {
  // Use fetchDataWithLock to handle the caching and potential concurrent fetches
  return fetchDataWithLock(slug, async () => {
    // Define the query to fetch data from Sanity
    const query = `
		  *[_type == "post" && slug.current == "${slug}"][0] {
      title,
      slug,
      publishedAt,
      updatedAt,
      excerpt,
      "featuredImage": {
        "alt": featuredImage.image.alt,
        "url": featuredImage.image.asset->url
      },
      _id,
      body,
      tags[]-> {
          _id,
          slug,
          name
        }
    }
    `;

    // Directly fetch the data from Sanity
    const post= await client.fetch(query,{cache: 'force-cache'});

    // No need to explicitly call setCache here as fetchDataWithLock will handle it
    return post;
  }); 
}

export const revalidate = 3600


//dynamic metagenerator 
export async function generateMetadata({ params }: { params: { slug: string } }, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug;
  const post: Post = await getPost(slug);

  if (!post) {
    return{};
  }

  const featuredImage = post.featuredImage ? post.featuredImage.url : undefined;
  const featuredImageAlt = post.featuredImage ? post.featuredImage.alt : 'Default alt text if none provided';

  return {
    title: post?.title,
   description: post?.excerpt,
   openGraph: {
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || post.publishedAt,
    url: `https://project-ai-blog.vercel.app/${slug}`, // Adjust with your actual URL structure
      title: post.title,
      description: post.excerpt,
      images: featuredImage ? [{
        url: featuredImage, // Directly use featuredImage
        width: 800,
        height: 600,
        alt: featuredImageAlt, // Use the alt text or default
      }] : [],
   },
   robots: {
    index: true, // or false to prevent this page from being indexed
    follow: true, // or false to instruct bots not to follow links from this page
  // Additional directives can be included as needed:
    noarchive: false, // Use true to prevent cached copies of this page from being available
    nosnippet: false, // Use true to prevent a text snippet or video preview from being shown in search results
    notranslate: false, // Use true to prevent translation of this page in search results
    noimageindex: false, // Use true to prevent images on this page from being indexed
  },
    }
};

interface TextChild {
  text: string;
}

interface TextBlock {
  children: TextChild[];
}

// If your actual data structure is more complex, you might need to adjust these interfaces accordingly.
const calculateReadingTime = (textBlocks: TextBlock[]): number => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = textBlocks
    .flatMap(block => block.children?.map(child => child.text))
    .join(' ')
    .split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

//page is generated from getPost 
const page = async ({params}: Params) => {
    const post: Post = await getPost(params?.slug);
    const nonce = headers().get('x-nonce') || ""

    if (!post) {
       notFound();
    }

    const headings = extractAndNestHeadingsFromBody(post.body)
    const readingTime = calculateReadingTime(post.body);
    const featuredImageSrc = post.featuredImage ? post.featuredImage.url : undefined;
    const featuredImageAlt = post.featuredImage ? post.featuredImage.alt : 'Default alt text if none provided';


    const jsonLd = {
      "@context": "http://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://project-ai-blog.vercel.app/${params.slug}`
      },
      "headline": post.title,
      "image": featuredImageSrc ? [{
        "@type": "ImageObject",
        "url": featuredImageSrc,
        "alt": featuredImageAlt
    }] : undefined,

      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt ? post.updatedAt : post.publishedAt,
      "author": {
        "@type": "Person",
        "name": "Ezra Leong" // Modify as needed
      },
      "publisher": {
        "@type": "Person",
        "name": "Ezra Leong", // Modify as needed
        "logo": {
          "@type": "ImageObject",
          "url": "https://example.com/logo.png" // Modify as needed
        }
      },
      "description": post.excerpt
    };

  //below the div className of portabletext is essentially uploads fetches the content you've written and displays it to the front end. 
  return (
    <>
    <Script
          id='pages-structured-data'
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    <div className="flex flex-col lg:flex-row min-h-screen">
    <div className="sticky top-32 lg:max-h-[calc(100vh*4/6)] lg:overflow-auto custom-scrollbar text-sm shrink-0 lg:w-48 sm:max-h-screen sm:overflow-y-auto sm:w-auto">
          <ResponsiveSidebarWrapper>
    
            {headings && headings.length > 0 && (
             <div className="lg:hidden block sticky top-32 max-h-[calc(100vh*4/6)] overflow-auto custom-scrollbar text-sm flex-shrink-0 w-full">
                <TableOfContents headings={headings}/>
            </div>
              )}
          </ResponsiveSidebarWrapper>
      </div>    
        <article className="flex-grow flex flex-col items-center">
            <Header title={post?.title}/>
            
            <div className='text-center w-full sm:max-w-prose md:max-w-2xl mx-auto'>
              <div className='text-sm'>
                <Link href='/about' className='author-link'>By Ezra Leong</Link>
                <div className="date-info">
               <time className="published-date" dateTime={post?.publishedAt}>
                Published on: {new Date(post?.publishedAt).toDateString()}
               </time>
               {post?.updatedAt && new Date(post?.updatedAt).toDateString() !== new Date(post?.publishedAt).toDateString() && (
                 <time className="updated-date" dateTime={post?.updatedAt}>
                  <br />Updated on: {new Date(post?.updatedAt).toDateString()}
                </time>
                  )}
            </div>
                <div className="reading-time">
                          Reading time: {readingTime} minutes
              </div>
              </div>
            
                <div className='mt-5'>
                    {post?.tags?.map((tag) => {
                        if (!tag || !tag.slug || !tag.slug.current) {
                            console.warn('Tag or tag.slug or tag.slug.current is undefined', tag);
                            return null; // Adjusted to return null for consistency
                        }
                        return (
                            <Link key={tag._id} href={`/tag/${tag.slug.current}`}>
                                <div className='inline-flex mr-1 p-2 rounded-full text-sm bg-black text-white dark:bg-white dark:text-black'>
                                    #{tag.name}
                                </div>
                            </Link>
                        );
                    })}
                </div>
                {/*add speak function*/}
                <TextToSpeechButton blocks={post.body}/>

                      {/* Featured Image and PortableText content */}
                        <div className="content-container my-4" aria-label="featured-image">
                        {featuredImageSrc && (
                        <div className="hidden lg:block md:block">
                          <Image 
                            src={featuredImageSrc} 
                            alt={featuredImageAlt} 
                            width={250} 
                            height={250} 
                            className="float-left mr-4 mt-12 max-w-2xl sm:px-6 w-auto m-auto" />
                        </div>
                      )}
                      </div>

                <div className={richTextStyles}>
                    <PortableText value={post.body} components={myPortableTextComponents} />
                </div>
              
            </div>
        </article>
        {headings && headings.length > 0 && (
               <div id='table-of-content' className="hidden lg:block sticky top-32 max-h-[calc(100vh*4/6)] overflow-auto custom-scrollbar text-sm flex-shrink-0 w-60">
              <TableOfContents headings={headings}/>
              </div>
        )}
    </div>
    </>
);
};


export default page

interface MarkDef {
  _key: string;
  _type: string;
  href?: string;
  newWindow?: boolean;
  internalLink?: {
  _ref: string;
  // Add other properties as needed
};
}

interface Span {
  _key?: string;
  text: string;
  marks?: string[];
}

interface Block {
  _key: string;
  _type: 'block';
  style: string;
  children: Span[];
  markDefs: MarkDef[];
}

interface CodeBlockValue {
  _type: 'codeBlock';
  code: string;
  language?: string;
}

interface TableRow {
  _key: string;
  _type: 'tableRow';
  cells: string[]; // Cells are just strings
}

interface Table {
  _key: string;
  _type: 'table';
  rows: TableRow[];
}

const generateSlug = (text: string): string =>
text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

// Updated serializer to include new window functionality for links
const myPortableTextComponents: Partial<PortableTextProps['components']> = {
  types: {
    block: ({ value }: { value: Block }) => {
      const { style, _key, children, markDefs } = value;

      const renderText = (text: string, marks?: string[]): JSX.Element | string => {
        if (!marks || marks.length === 0) return text;

        return marks.reduce((acc: JSX.Element | string, mark: string) => {
          const markDef = markDefs.find((def) => def._key === mark);
          if (markDef?._type === 'link') {
            if (markDef.href) {
              // Open in new window if newWindow is true
              const target = markDef.newWindow ? '_blank' : undefined;
              const rel = target ? 'noopener noreferrer' : undefined;
              return (
                <a href={markDef.href} target={target} rel={rel} key={markDef._key}>
                  {acc}
                </a>
              );
            }
          }
          // Handle other marks like 'strong' and 'em'
          switch (mark) {
            case 'strong':
              return <strong key={_key}>{acc}</strong>;
            case 'em':
              return <em key={_key}>{acc}</em>;
            case 'strike-through': // Handling for strike-through
              return <s key={_key}>{acc}</s>;
            case 'code':
              return <code key={_key} className='custom-code-style dark:bg-zinc-800 dark:rounded-md dark:text-white sm:text-black sm:dark:text-white'>{acc}</code>;
            default:
              return acc;
          }
        }, <span className="text-inherit">{text}</span>);
      };

      const renderChildren = (children: Span[]): JSX.Element[] =>
        children.map((child: Span, index: number) => (
          <span key={child._key || index.toString()}>
            {renderText(child.text, child.marks)}
          </span>
        ));

      if (/^h[1-6]$/.test(style)) {
        const headingId = generateSlug(children?.[0]?.text.toString()) || `heading-${_key}`;
        const HeadingTag = style as keyof JSX.IntrinsicElements;
        return React.createElement(HeadingTag, { id: headingId, key: _key }, renderChildren(children));
      }

      return <p key={_key}>{renderChildren(children)}</p>;
    },
    image: ({ value }) => (
      <ImageEnlargeOverlay
        src={urlForImage(value).url()}
        alt={value.alt || 'Post Image'}
        width={700}
        height={700}
      />
    ),

    codeBlock: ({ value }: { value: CodeBlockValue }) => {
      // Ensure a fallback for unregistered or "none" language
      const registeredLanguages = ['javascript', 'tsx', 'typescript']; // Add all languages you've registered
      const language = value.language && registeredLanguages.includes(value.language) 
      ? value.language 
      : 'tsx';    
      return (
        <div className="relative">
          <pre className="md:flex overflow-auto p-3 my-2 rounded-lg w-auto h-2/6 bg-prismjs-default shadow-md dark:shadow-gray-700 mt-2" itemProp="sampleType">
            {/* Use "plaintext" or another safe default for unknown languages */}
            <Refractor language={language} value={value.code} className='custom-scrollbar  text-black dark:text-white'/>
          </pre>
          <div className="absolute bottom-0 right-2">
            <CopyToClipboard textToCopy={value.code} />
          </div>
        </div>
      );
    },

    table: ({ value }: { value: Table }) => (
      // Wrap the table in a div with overflow-x-auto to allow horizontal scrolling on small screens
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200 ">
          <tbody className="divide-y divide-gray-200">
            {value.rows.map((row, rowIndex) => (
              <tr key={row._key || rowIndex}>
                {row.cells.map((cellContent, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 text-sm text-left">
                    {cellContent} {/* Directly render the string content of the cell */}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const { href, newWindow } = value;
      const target = newWindow ? '_blank' : undefined;
      const rel = target ? 'noopener noreferrer' : undefined;
      return (
        <a href={href} target={target} rel={rel}>
          {children}
        </a>
      );
    },
    'strike-through': ({ children }) => <del>{children}</del>,
  },
  // Add other custom serializers as need
}

const richTextStyles = `

mt-14 
text-justify
max-w-2xl
sm:px-6 w-auto
m-auto
prose-headings:my-5
prose-h1:text-3xl 
prose-h1:font-bold
prose-h2:text-xl
prose-h2:font-bold 
prose-h3:font-bold
prose-h4:font-bold
prose-h5:font-bold
prose-h6:font-bold
prose-p:mb-5
prose-p: leading-9 
prose-li:list-disc
prose-li:leading-7
prose-li:ml-4 
prose-a:text-gray-500 
prose-a:italic
prose-a:underline

`;


