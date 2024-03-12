import { client } from "@/sanity/lib/client";
import React from 'react';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';
import Header from '@/app/components/Header';
import TableOfContents from '@/app/components/ToC';
import { extractAndNestHeadingsFromBody } from '@/app/components/ToC';
import notFound from "./not-found";
import CopyToClipboard from "@/app/components/CopytoClipboard";
import { PortableTextProps } from "@portabletext/react";
import { SEO } from "@/app/utils.tsx/Interface";
import LeftSideNavbar, { SEODocument } from "@/app/components/LeftSideNavbar";
import ResponsiveSidebarWrapper from "@/app/components/ResponsiveSideBar";
import { ResolvingMetadata } from "next";
import { Metadata } from "next";
import { fetchDataWithLock } from "@/app/utils.tsx/cache";
import Script from "next/script";
import { headers } from "next/headers";

interface Params {
    params: {
        slug: string; 
    };
    searchParams: {[key: string]: string | string[] | undefined};
}
//issue definitely has to be with static pre-render from generate static params
//export async function generateStaticParams() {
  //const allSEODocuments = await client.fetch(`*[_type == "seo"]{ "slug": slug.current }`);
  //return allSEODocuments.map((seo: SEO) => ({
    //params: { slug: seo.slug },
  //}));
//}

//fetch function for generating links for the leftsidenavbar component. 
async function fetchSEOLinksTitles() {
  // Provide a fallback to localhost if NEXT_PUBLIC_BASE_URL is not defined
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const apiUrl = `${baseUrl}/api/routes`; // Ensure this endpoint matches your API route

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch SEO links titles from ${apiUrl}`);
    }
    const documents = await response.json();
    return documents;
  } catch (error) {
    console.error('Error fetching SEO documents:', error);
    throw error; // Re-throw the error to handle it in the calling code if necessary
  }
}

async function getSEOData(slug: string) {
  // Use fetchDataWithLock to handle the caching and potential concurrent fetches
  return fetchDataWithLock(slug, async () => {
    // Define the query to fetch data from Sanity
    const query = `
      *[_type == "seo" && slug.current == "${slug}"][0] {
        title,
        slug,
        publishedAt,
        updatedAt,
        excerpt,
        _id,
        body,
        tags[]-> {
            _id,
            name
          }
      }
    `;

    // Directly fetch the data from Sanity
    const seoData = await client.fetch(query);

    // No need to explicitly call setCache here as fetchDataWithLock will handle it
    return seoData;
  }, 3600); // Assuming TTL is 6000 seconds (100 minutes)
}

interface BaseBlock {
  _type: string;
}

interface ImageBlock extends BaseBlock {
  _type: 'image';
  asset: {
    _ref: string;
  };
}

// Assuming OtherBlock could be of any type other than 'image'
interface OtherBlock extends BaseBlock {
  // Other properties specific to non-image blocks
}

// Union type for content blocks
type ContentBlock = ImageBlock | OtherBlock;

const findFirstImageUrl = (body: ContentBlock[]): string | undefined => {
  // Explicit type guard to ensure the block is an ImageBlock
  const imageBlock = body.find((block): block is ImageBlock => block._type === 'image' && 'asset' in block) as ImageBlock | undefined;

  // Assuming urlForImage is properly typed to accept ImageBlock['asset'] and return an object with a .url() method
  return imageBlock ? urlForImage(imageBlock.asset).url() : undefined;
};

export async function generateMetadata({ params }: { params: { slug: string } }, parent: ResolvingMetadata): Promise<Metadata> {
  const slug = params.slug;
  const seoData: SEO = await getSEOData(slug);

  if (!seoData) {
    return {}; 
  }

  const imageUrl = findFirstImageUrl(seoData.body); // Assuming seoData.body is an array of ContentBlocks

  return {
    title: seoData?.title,
    description: seoData?.excerpt,
    authors: [{name: 'Ezra Leong', url: 'https://project-ai-blog.vercel.app/about'}],
    openGraph: {
      type: 'article',
      publishedTime: seoData.publishedAt,
      modifiedTime: seoData.updatedAt || seoData.publishedAt,
      url: `https://project-ai-blog.vercel.app/${slug}`, // Adjust with your actual URL structure
      title: seoData.title,
      description: seoData.excerpt,
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 600, alt: seoData.title }] : [],
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
  };
}

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


const SEOPage = async ({ params }: Params) => {
    const seoData: SEO = await getSEOData(params?.slug);
    const links: SEODocument[] = await fetchSEOLinksTitles()
    const nonce = headers().get('x-nonce') || ""

    if (!seoData) {
        notFound(); 
    }

    const headings = extractAndNestHeadingsFromBody(seoData.body);
    const imageUrl = findFirstImageUrl(seoData.body);
    const readingTime = calculateReadingTime(seoData.body);

    const jsonLd = {
      "@context": "http://schema.org",
      "@type": "Article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://project-ai-blog.vercel.app/${params.slug}`
      },
      "headline": seoData.title,
      "image": imageUrl ? [imageUrl] : undefined,
      "datePublished": seoData.publishedAt,
      "dateModified": seoData.updatedAt ? seoData.updatedAt : seoData.publishedAt,
      "author": {
        "@type": "Person",
        "name": "Ezra" // Modify as needed
      },
      "publisher": {
        "@type": "Person",
        "name": "Ezra Leong", // Modify as needed
        "logo": {
          "@type": "ImageObject",
          "url": "https://example.com/logo.png" // Modify as needed
        }
      },
      "description": seoData.excerpt
    };

    return (
      <>
        <Script
          id="seo-structured-data"
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
       
        <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="sticky top-32 lg:max-h-[calc(100vh*4/6)] lg:overflow-auto custom-scrollbar text-sm shrink-0 lg:w-48 sm:max-h-screen sm:overflow-y-auto sm:w-auto">
          <ResponsiveSidebarWrapper>
            <LeftSideNavbar seoDocuments={links}/>
            {headings && headings.length > 0 && (
             <div className="lg:hidden block sticky top-32 max-h-[calc(100vh*4/6)] overflow-auto custom-scrollbar text-sm flex-shrink-0 w-full">
                <TableOfContents headings={headings}/>
            </div>
              )}
          </ResponsiveSidebarWrapper>
        </div>
            <article className="flex-grow flex flex-col items-center">
                <Header title={seoData?.title}/>
                
                <div className='text-center w-full sm:max-w-prose md:max-w-2xl mx-auto'>
                  <div className="text-sm">
                    <Link href='/about' className='author-link'>By Ezra Leong</Link>
                     <div className="date-info">
                  <time className="published-date" dateTime={seoData?.publishedAt}>
                    Published on: {new Date(seoData?.publishedAt).toDateString()}
                  </time>
                    {seoData?.updatedAt && new Date(seoData?.updatedAt).toDateString() !== new Date(seoData?.publishedAt).toDateString() && (
                      <time className="updated-date" dateTime={seoData?.updatedAt}>
                        <br />Updated on: {new Date(seoData?.updatedAt).toDateString()}
                      </time>
                      )}
                      <div className="reading-time">
                        <div className="text-sm">
                          Reading time: {readingTime} minutes
                        </div>
                    </div>
                    </div>
                  </div>
                    <div className='mt-5'>
                        {seoData?.tags?.map((tag) => {
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
                    <div className={richTextStyles}>
                        <PortableText value={seoData.body} components={myPortableTextComponents} />
                    </div>
                </div>
            </article>
            {headings && headings.length > 0 && (
               <div className="hidden lg:block sticky top-32 max-h-[calc(100vh*4/6)] overflow-auto custom-scrollbar text-sm flex-shrink-0 w-60">
              <TableOfContents headings={headings}/>
              </div>
        )}
        </div>
        </>
    );
};

export default SEOPage;

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
            default:
              return acc;
          }
        }, text);
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
      <Image
        src={urlForImage(value).url()}
        alt={value.alt || 'Post Image'}
        width={700}
        height={700}
        layout='responsive'
      />
    ),
    codeBlock: ({ value }: { value: CodeBlockValue }) => (
      <div className="relative">
      <pre className="text-inherit custom-scrollbar md:flex overflow-auto overflow-y-auto p-3 my-2 rounded-lg w-auto h-96 bg-inherit shadow-md dark:bg-inherit dark:shadow-gray-700">
        <code className="language-javascript">{value.code}</code>
      </pre>
      <div className="absolute bottom-0 right-0 m-2">
        <CopyToClipboard textToCopy={value.code} />
      </div>
    </div>
    ),

    table: ({ value }: { value: Table }) => (
      // Wrap the table in a div with overflow-x-auto to allow horizontal scrolling on small screens
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200 ">
          <tbody className="divide-y divide-gray-200">
            {value.rows.map((row, rowIndex) => (
              <tr key={row._key || rowIndex}>
                {row.cells.map((cellContent, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
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
  // Add other custom serializers as needed
};
  
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
  prose-code:text-red-500
  
  `;