import { MetadataRoute } from 'next';
import { client } from "@/sanity/lib/client";

interface DocumentData {
  _type: string;
  slug: string;
  updatedAt: string;
}

async function fetchDocuments(): Promise<DocumentData[]> {
  const query = `*[_type in ["post", "seo"]]{
    _type,
    "slug": slug.current,
    "updatedAt": coalesce(updatedAt, publishedAt)
  }`;
  const results: DocumentData[] = await client.fetch(query);
  return results;
}

async function generateSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const documents = await fetchDocuments();
  const rootUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://project-ai-blog.vercel.app/';
  
  // Prepare the list of documents, excluding priority
  const documentEntries = documents.map(({ _type, slug, updatedAt }) => {
    const pathPrefix = _type === 'seo' ? '/seodocuments' : '/posts';
    const changeFrequency: 'weekly' = 'weekly'
    return {
      url: `${rootUrl}${pathPrefix}/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency,
    };
  });

  // Add the root page to the list with a high priority if needed, or simply include it without priority
  const rootEntry = {
    url: rootUrl,
    lastModified: new Date(), // You might want to set this to the most recent update date of your site
    changeFrequency: 'daily' as 'daily', // Assuming the homepage might change more frequently
    prioirtiy: 1.0,
  };

  return [rootEntry, ...documentEntries];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return generateSitemapEntries();
}
