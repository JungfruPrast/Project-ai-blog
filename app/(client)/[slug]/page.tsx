import React from 'react';
import { client } from '@/sanity/lib/client'; // Adjust the import path as necessary
import Header from '@/app/components/Header';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
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
        <PortableText value={pageData?.body} />
      </div>
      </div>
    </div>
  );
};

export default renderPage;

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