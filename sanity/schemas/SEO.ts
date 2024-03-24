import { Rule } from "sanity";
//this is an example; this gets displayed in the sanity studio UI 

export const SEO = {
    name: "seo",
    title: "SEO",
    type: "document",

    fields: [ 
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule: Rule) => Rule.required().error('Required')
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title"}
        },
        {
            name: "publishedAt",
            title: "Published at",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        },
        {
            name: "updatedAt",
            title: "Updated at",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        },
        {
            name: "excerpt",
            title: "Excerpt",
            type: "text",
            validation: (Rule: Rule) => Rule.max(200).error('Max 200 characters')
        },
        {
            name: "firstParagraph",
            title: "First Paragraph",
            type: "text",
        },
        {
            title: "Featured Image",
            type: "object",
            name: "featuredImage",
            fields: [
              {
                name: "image",
                title: "Image",
                type: "image",
                fields: [
                  {
                    name: "alt",
                    title: "Alt Text",
                    type: "text",
                    validation: (Rule: Rule) => Rule.error('Alt text is required.').required()
                  }
                ],
                options: {
                  hotspot: true,
                },
              }
            ],
          },
        {
            name: "body",
            title: "Body",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H1", value: "h1" },
                        { title: "H2", value: "h2" },
                        { title: "H3", value: "h3" },
                        { title: "H4", value: "h4" },
                        { title: "H5", value: "h5" },
                        { title: "H6", value: "h6" },
                        { title: "Quote", value: "blockquote" },
                    ], // Include other styles as needed
                    marks: {
                        // Define the annotations for links
                        annotations: [
                            {
                                name: "link",
                                type: "object",
                                title: "Link",
                                fields: [
                                    {
                                        name: "href",
                                        title: "URL",
                                        type: "url",
                                        description: "Use for external links",
                                    },
                                    {
                                        name: "internalLink",
                                        title: "Internal Link",
                                        type: "reference",
                                        to: [{type: "seo"}], // Adjust to your internal document types
                                        description: "Use for internal links",
                                    },
                                    {
                                        name: "newWindow",
                                        title: "Open in new window",
                                        type: "boolean",
                                    }
                                ],
                            }
                        ],
                    },
                },
                {
                    type: "image",
                    fields: [{type: "text", name: "alt", title: "Alt"}],
                },
                {
                    title: "Code Block",
                    name: "codeBlock",
                    type: "code",
                    options: {
                      theme: 'github', // Optional: Specify a theme for the code editor
                      language: 'javascript', // Default language
                      languageAlternatives: [
                        { title: 'JavaScript', value: 'javascript' },
                        { title: 'HTML', value: 'html' },
                        { title: 'CSS', value: 'css' },
                    // Add other languages you support here
                      ],
                    },
                },
                {
                    // Add the table as a type option within the body field
                    type: 'table', // Ensure this matches the type name defined by @sanity/table or your custom configuration
                    title: 'Table', // Optional: Customize the display title for the table type in the studio UI
                },
            ],
        },
        {
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{type: "reference", to: [{type: "tag"}] }]
        },
        {
            name: "relatedpages",
            title: "Related Pages",
            type: "array",
            of: [{type: "reference", to: [{type: "seo"}] }]
        }
    ],
}
