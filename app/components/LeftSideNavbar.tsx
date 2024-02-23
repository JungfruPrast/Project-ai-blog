'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { client } from "@/sanity/lib/client";

// Define the SEODocument interface if not already defined
interface SEODocument {
  title: string;
  slug: { current: string; };
}

// No need for currentDocumentId in props if fetching all documents
const LeftSideNavbar: React.FC = () => {
  const [seoDocuments, setSeoDocuments] = useState<SEODocument[]>([]);

  useEffect(() => {
    const fetchSeoDocuments = async () => {
      const query = `
      *[_type == "seo"] | order(publishedAt asc) {
          title,
          "slug": slug.current
        }
      `;
      try {
        const documents: SEODocument[] = await client.fetch(query);
        setSeoDocuments(documents);
        console.log("Fetched SEO documents:", documents);
      } catch (error) {
        console.error("Error fetching SEO documents:", error);
      }
    };

    fetchSeoDocuments();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <nav>
      {seoDocuments.map((doc, index) => (
        <div key={index} className="mb-2">
          <Link href={`/seodocuments/${doc.slug}`}>
            <div className="block p-2 rounded hover:font-semibold">
              {doc.title}
            </div>
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default LeftSideNavbar;
