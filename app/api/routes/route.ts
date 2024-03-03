import { SEODocument } from "../../components/LeftSideNavbar";
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { setCache, getCache } from "../../utils.tsx/cache";
//Caching mechanism is completely invalidated due to serverless function that eliminates the memory file once the instance is completed. LOL
// At the top of your route.ts file 
const ongoingFetches = new Map();

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

// Modified GET function
export async function GET(request: NextRequest): Promise<NextResponse> {
  const cacheKey = 'seoLinksTitles';
  let data = getCache(cacheKey);

  // Check for an ongoing fetch
  if (!data) {
    if (!ongoingFetches.has(cacheKey)) {
      // If no ongoing fetch, start one and store the promise
      const fetchPromise = fetchSEOLinksTitles().then(fetchedData => {
        setCache(cacheKey, fetchedData, 3600); // Cache data for 1 hour
        ongoingFetches.delete(cacheKey); // Clean up
        return fetchedData;
      }).catch(error => {
        console.error('Failed to fetch SEO links titles:', error);
        ongoingFetches.delete(cacheKey); // Ensure to clean up on failure too
        throw error; // Re-throw to handle outside
      });
      
      ongoingFetches.set(cacheKey, fetchPromise);
      data = await fetchPromise; // Await the fetch promise
    } else {
      // If there's an ongoing fetch, wait for it
      data = await ongoingFetches.get(cacheKey);
    }
  }

  // Return the data in a NextResponse with Cache-Control header
  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Example Cache-Control header for caching; adjust max-age as needed
      'Cache-Control': 'public, max-age=3600, must-revalidate'
    },
  });
}
