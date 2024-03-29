export interface Post {
    title: string;
    slug: {current: string};
    publishedAt: string;
    updatedAt: string;
    excerpt: string;
    body: any;
    tags: Array<Tag>;
    _id: string;
    _type: string;
    featuredImage: {
        alt: string;
        url: string;
      };
}

export interface Tag {
    name: string;
    slug: {current: string};
    _id: string;
    postCount?: number
    seoCount?: number
}

export interface SEO {
    title: string;
    slug: {current: string};
    publishedAt: string; 
    updatedAt: string;
    excerpt: string;
    body: any; // You might want to define a more specific type for the body based on its content structure
    tags: Array<Tag>;
    _id: string;
    _type: string;
    featuredImage: {
        alt: string;
        url: string;
      };
}