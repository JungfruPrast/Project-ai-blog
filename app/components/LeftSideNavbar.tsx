// components/LeftSideNavbar.tsx

import Link from 'next/link';
import React from 'react';

// Define the structure of the SEO document
interface SEODocument {
  title: string;
  slug: {
    current: string;
  };
}

// Define the props expected by the LeftSideNavbar component
interface LeftSideNavbarProps {
  seoDocuments: SEODocument[];
}

// LeftSideNavbar component adjusted with Tailwind CSS from TableOfContents
const LeftSideNavbar: React.FC<LeftSideNavbarProps> = ({ seoDocuments }) => {
  return (
    // Mimicking the styling of TableOfContents: fixed position, width, height adjustments, overflow handling, and custom scrollbar.
    <nav className='mt-16'>
      {seoDocuments.map((seoDocument, index) => (
        <div key={index} className="mb-2">
          <Link href={`/seodocument/${seoDocument.slug.current}`} passHref>
            <div className="block p-2 rounded hover:bg-zinc-900">
              {seoDocument.title}
            </div>
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default LeftSideNavbar;
