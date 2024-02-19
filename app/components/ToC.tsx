// ToC.tsx 
import React from 'react';

// Assuming TypeScript is being used, define interfaces for props and content blocks
interface BlockChild {
  text: string;
}

interface ContentBlock {
  _key: string;
  style: string;
  children: BlockChild[];
}

interface Heading {
  id: string;
  text: string;
  level: string;
  children?: Heading[];
}

interface TableOfContentsProps {
  headings: Heading[];
}

// Utility function to nest headings
const nestHeadings = (headings: Heading[]): Heading[] => {
  const root: Heading = { id: 'toc-root', text: 'On this page', level: 'h0', children: [] }; // Root for nested headings
  headings.forEach(heading => {
    let level = parseInt(heading.level.substring(1)); // Convert 'h2' to 2
    let currentLevel = root; // Start from the root
    for (let i = 1; i < level; i++) { // Dive into the tree up to the current level
      if (!currentLevel.children) {
        currentLevel.children = [];
      }
      if (!currentLevel.children[currentLevel.children.length - 1]) {
        currentLevel.children.push({ id: `auto-gen-${i}`, text: `On this page`, level: `h${i}`, children: [] });
      }
      currentLevel = currentLevel.children[currentLevel.children.length - 1];
    }
    if (!currentLevel.children) {
      currentLevel.children = [];
    }
    currentLevel.children.push(heading);
  });
  return root.children || [];
};

// Update the function signature to use the ContentBlock type and nest headings
const generateSlug = (text: string): string =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export const extractAndNestHeadingsFromBody = (body: ContentBlock[]): Heading[] => {
  const flatHeadings = body
    .filter(block => block.style && block.style.startsWith('h') && block.children && block.children.length > 0)
    .map(heading => {
      const slugId = generateSlug(heading.children[0].text); // Generate slug based on heading text
      return {
        id: slugId, // Use the generated slug as the ID
        text: heading.children[0].text,
        level: heading.style,
        children: []
      };
    });
  return nestHeadings(flatHeadings);
};

// Recursive component to render nested headings
const RenderHeadings = ({ headings }: { headings: Heading[] }) => (
  <ul className='space-y-1 text-left'>
    {headings.map(heading => (
      <li key={heading.id}>
        <a href={`#${heading.id}`} className='block p-2 hover:bg-inherit dark:hover:bg-zinc-900'>
          {heading.text}
        </a>
        {heading.children && heading.children.length > 0 && <RenderHeadings headings={heading.children} />}
      </li>
    ))}
  </ul>
);

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  return (
    <nav aria-label="Table of contents">
      <RenderHeadings headings={headings} />
    </nav>
  );
};

export default TableOfContents;