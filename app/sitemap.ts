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
  const rootUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  return documents.map(({ _type, slug, updatedAt }) => {
    const pathPrefix = _type === 'seo' ? '/seodocuments' : '/posts';
    return {
      url: `${rootUrl}${pathPrefix}/${slug}`,
      lastModified: new Date(updatedAt),
      changeFrequency: 'weekly',
      priority: _type === 'seo' ? 0.7 : 0.5, // Example of adjusting priority based on document type
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return generateSitemapEntries();
}
