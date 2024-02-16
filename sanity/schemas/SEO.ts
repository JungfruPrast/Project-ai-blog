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
            name: "excerpt",
            title: "Excerpt",
            type: "text",
            validation: (Rule: Rule) => Rule.max(200).error('Max 200 characters')
        },
        {
            name: "body",
            title: "Body",
            type: "array",
            of: [
                {type: "block"},
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
        }
    ],
}
