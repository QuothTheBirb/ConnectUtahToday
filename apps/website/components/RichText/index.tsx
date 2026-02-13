import React from 'react';

// TODO: Temporary implementation, clean up later

export const RichText = ({ content, className }: { content: any; className?: string }) => {
  if (!content || !content.root || !content.root.children) {
    return null;
  }

  return (
    <div className={className}>
      {content.root.children.map((node: any, index: number) => renderNode(node, index))}
    </div>
  );
};

const renderNode = (node: any, index: number) => {
  if (!node) return null;

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={index}>
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </p>
      );
    case 'list':
      const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
      return (
        <ListTag key={index}>
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </ListTag>
      );
    case 'listitem':
      return (
        <li key={index}>
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </li>
      );
    case 'heading':
      const HeadingTag = node.tag || 'h2';
      return (
        <HeadingTag key={index}>
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </HeadingTag>
      );
    case 'text':
        let text: React.ReactNode = node.text;
        if (node.format & 1) text = <strong key={`b-${index}`}>{text}</strong>;
        if (node.format & 2) text = <em key={`i-${index}`}>{text}</em>;
        if (node.format & 4) text = <u key={`u-${index}`}>{text}</u>;
        if (node.format & 8) text = <code key={`c-${index}`}>{text}</code>;
        if (node.format & 16) text = <span key={`s-${index}`} style={{ textDecoration: 'line-through' }}>{text}</span>;
        return <React.Fragment key={index}>{text}</React.Fragment>;
    case 'link':
      return (
        <a
          key={index}
          href={node.fields?.url}
          target={node.fields?.newTab ? '_blank' : undefined}
          rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
        >
          {node.children?.map((c: any, i: number) => renderNode(c, i))}
        </a>
      );
    case 'linebreak':
        return <br key={index} />
    default:
      return null;
  }
};

export default RichText;
