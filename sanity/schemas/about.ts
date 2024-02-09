export const about = {
    name: "page",
    title: "Pages",
    type: "document",
    fields: [
      {
        name: "title",
        title: "Title",
        type: "string",
        
    },
      { 
        title: "Name", 
        name: "name", 
        type: "string", 
      },
      {
        title: "Slug",
        name: "slug",
        type: "slug",
        options: {source:"title"},
      },
      { 
        title: "Excerpt", 
        name: "excerpt", 
        type: "string", 
      },
      { 
        title: "Image", 
        name: "image", 
        type: "image", 
        options: {hotspot: true},
        fields: [{
          name: "alt",
          title: "Alt",
          type: "string"
      }]
      },
    
      {
        name: "body",
        title: "Body",
        type: "array",
        of: [{type: "block"}],
    },
    ]}