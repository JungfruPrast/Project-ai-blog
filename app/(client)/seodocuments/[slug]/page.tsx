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
import LeftSideNavbar from "@/app/components/LeftSideNavbar";
import ResponsiveSidebarWrapper from "@/app/components/ResponsiveSideBar";
import { ResolvingMetadata } from "next";
import { Metadata } from "next";

interface Params {
    params: {
        slug: string; 
    };
    searchParams: {[key: string]: string | string[] | undefined};
}

async function getSEOData(slug: string) {
    const query = `
    *[_type == "seo" && slug.current == "${slug}"][0] {
      title,
      slug,
      publishedAt,
      excerpt,
      _id,
      body,
      "tags": tags[]-> {
          _id,
          name
        }
    }
    `;

    const seoData = await client.fetch(query);
    console.log(seoData.title); // Debugging log
    console.log(seoData.publishedAt);
    return seoData;
}

export const revalidate = 600;


export async function generateMetadata({ params }: { params: { slug: string } }, parent: ResolvingMetadata): Promise<Metadata> {
const slug = params.slug;
const seo: SEO = await getSEOData(slug);

return {
title: seo?.title,
description: seo?.excerpt
}
    // Add other metadata fields as needed e.g opengraph 
};

const SEOPage = async ({ params }: Params) => {
    const seoData: SEO = await getSEOData(params?.slug);

    if (!seoData) {
        notFound();
    }

    const headings = extractAndNestHeadingsFromBody(seoData.body);

    const navbarData = seoData ? [{ title: seoData?.title, slug: seoData?.slug }] : [];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen">
            <div className="sticky top-28 max-h-[calc(100vh*4/6)] overflow-auto text-sm custom-scrollbar flex-shrink-0 w-auto">
             <ResponsiveSidebarWrapper>
              <LeftSideNavbar seoDocuments={navbarData}/>
            </ResponsiveSidebarWrapper>
            </div>
            <article className="flex-grow flex flex-col items-center">
                <Header title={seoData?.title}/>
                <div className='text-center w-full sm:max-w-prose md:max-w-2xl mx-auto'>
                    <span className='date'>{new Date(seoData?.publishedAt).toDateString()}</span>
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
              <div className="sticky top-32 max-h-[calc(100vh*4/6)] overflow-auto text-sm custom-scrollbar flex-shrink-0 w-60">
              <TableOfContents headings={headings}/>
              </div>
        )}
        </div>
    );
};

export default SEOPage;

interface MarkDef {
    _key: string;
    _type: string;
    href?: string;
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
  
  
   const myPortableTextComponents: Partial<PortableTextProps['components']> = {
    types: {
      block: ({ value }: { value: Block }) => {
        const { style, _key, children, markDefs } = value;
    
        const findMarkDef = (key: string): MarkDef | undefined => markDefs.find((def: MarkDef) => def._key === key);
    
        const renderText = (text: string, marks?: string[]): JSX.Element | string => {
          if (!marks || marks.length === 0) return text;
    
          return marks.reduce((acc: JSX.Element | string, mark: string) => {
            switch (mark) {
              case 'strong':
                return <strong>{acc}</strong>;
              case 'em':
                return <em>{acc}</em>;
              default:
                const markDef = findMarkDef(mark);
                if (markDef?._type === 'link' && markDef.href) {
                  return (
                    <Link href={markDef.href} key={markDef._key}>
                      {acc}
                    </Link>
                  );
                }
                return acc;
            }
          }, text);
        };
    
        const renderChildren = (children: Span[]): JSX.Element[] => {
          return children.map((child: Span, index: number) => {
            return (
              <span key={child._key || index.toString()}>
                {renderText(child.text, child.marks)}
              </span>
            );
          });
        };
    
        if (/^h[1-6]$/.test(style)) {
          const headingId = generateSlug(children?.[0]?.text.toString()) || `heading-${_key}`;
          const HeadingTag = style as keyof JSX.IntrinsicElements;
          return React.createElement(HeadingTag, { id: headingId, key: _key }, renderChildren(children));
        }
    
        return <p key={_key}>{renderChildren(children)}</p>;
      },
    
      image: ({ value }: { value: any }) => (
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
      
  
    }
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