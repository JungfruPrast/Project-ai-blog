import { Rule } from "sanity";
import { defineConfig } from "sanity";
import { CodeInput } from "@sanity/code-input";
//this is an example; this gets displayed in the sanity studio UI 

export const post = {
    name: "post",
    title: "Post",
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
            ]}}
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