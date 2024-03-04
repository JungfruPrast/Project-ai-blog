import { SEODocument } from "../../components/LeftSideNavbar";
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { fetchDataWithLock } from "../../utils.tsx/cache";

async function fetchSEOLinksTitles() {
    const query = `
        *[_type == "seo"] | order(publishedAt asc) {
            title,
            "slug": slug.current
          }
        `;
    const documents: SEODocument[] = await client.fetch(query);
    return documents;
}

// Simplified GET function using fetchDataWithLock
export async function GET(request: NextRequest): Promise<NextResponse> {
  const cacheKey = 'seoLinksTitles';
  
  // Use fetchDataWithLock to either get the cached data or fetch new data if not cached or expired.
  const data = await fetchDataWithLock(cacheKey, fetchSEOLinksTitles, 3600); // TTL set to 3600 seconds (1 hour)

  // Return the data in a NextResponse with appropriate headers
  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, must-revalidate', // Cache-Control header for client-side caching
    },
  });
}
