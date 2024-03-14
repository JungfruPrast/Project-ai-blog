import React from 'react';
import { client } from '@/sanity/lib/client'; // Adjust the import path as necessary
import Header from '@/app/components/Header';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import CopyToClipboard from '@/app/components/CopytoClipboard';
import { PortableTextProps } from '@portabletext/react';
import Image from 'next/image';
import { urlForImage } from '@/sanity/lib/image';

// Update the interface to match the new schema
interface PageData {
  title: string;
  name: string; // Added based on your new schema
  excerpt: string;
  slug: { current: string; };
  image?: {
    asset: {
      _ref: string;
      url: string; // Assuming you're transforming asset references to URLs
    };
    alt?: string;
  };
  body: any[]; // Adjust according to your content structure
}

//testing out this change. 
export const dynamic = 'force-dynamic'

// Adjust the function to fetch page data instead of post data
const fetchPageData = async (slug: string): Promise<PageData> => {
  const query = `
    *[_type == "page" && slug.current == "${slug}"][0] {
      title,
      name,
      excerpt,
      "slug": slug.current,
      "image": {
        asset->{
          _ref,
          url
        },
        alt
      },
      body
    }
  `;

  const params = { slug };
  const pageData: PageData = await client.fetch(query, params);
  return pageData;
};

export const revalidate = 600;

export async function generateStaticParams() {
  const allPages = await client.fetch(`*[_type == "page"]{ "slug": slug.current }`);
  return allPages.map((pagedata: PageData) => ({
    params: { slug: pagedata.slug },
  }));
}

// Adjust parameters to match expected types and structure
interface Params {
  params: {
    slug: string;
  };
}

const renderPage = async ({ params }: Params) => {
  const pageData: PageData = await fetchPageData(params.slug);

  if (!pageData) {
    // Handle not found
    notFound();
    
   // Ensure execution stops here if notFound is handled
  }

  // Proceed with rendering using the fetched page data
  // This illustrative logic assumes execution in an environment where JSX can be directly returned from async functions.
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full lg:max-w-6xl">
      <div className="w-full">
        
          <Header title={pageData?.title} />
        
       
      <div className={richTextStyles}>
        <PortableText value={pageData?.body} components={myPortableTextComponents} />
      </div>
      </div>
    </div>
  );
};

export default renderPage;

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
          case 'code':
            return <code key={_key}>{acc}</code>;
          case 'strike-through': // Handling for strike-through
            return <s key={_key}>{acc}</s>; 
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
m-auto
prose-headings:my-5
prose-h1:text-3xl 
prose-h1:font-bold
prose-h2:text-xl
prose-h2:font-bold 
prose-h3:font-bold
prose-h4:font-bold
prose-h5:font-bold
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