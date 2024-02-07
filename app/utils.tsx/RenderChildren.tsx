//not in use 

export const renderChildren = (children: any[] = [], generateSlug?: (text: string) => string) => {
  // Ensure children is always an array to prevent runtime errors
  if (!Array.isArray(children)) {
    console.warn('renderChildren called with non-array children:', children);
    return null; // Or an appropriate fallback value
  }

  return children.map((child: any) => {
    if (child._type === 'span') {
      let spanContent = child.text;

      // Apply styles based on marks (e.g., strong, em)
      child.marks?.forEach((mark: any) => {
        switch (mark) {
          case 'strong':
            spanContent = <strong key={child._key}>{spanContent}</strong>;
            break;
          case 'em':
            spanContent = <em key={child._key}>{spanContent}</em>;
            break;
          case 'code':
            spanContent = <code key={child._key}>{spanContent}</code>;
            break;
          // Add more cases as needed
        }
      });

      return spanContent;
    } else if (child._type === 'link') {
      // Render links
      return (
        <a href={child.href} key={child._key} target="_blank" rel="noopener noreferrer">
          {renderChildren(child.children, generateSlug)}
        </a>
      );
    }

    // Fallback for other types
    return child.text || null;
  });
};
