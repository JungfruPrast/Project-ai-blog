import { defineType } from "sanity";
//this is further detailing of what the tag does. 

export const tag = defineType({
    name: "tag",
    title: "Tag",
    type: "document",
    fields: [{
        name: "name",
        title: "Tag name",
        type: "string"
    }, {
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
            source: "name"
        }
    }
    ]

})