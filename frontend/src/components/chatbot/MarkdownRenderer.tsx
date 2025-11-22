import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        strong: ({ children }) => <span className="text-green-400 font-bold">{children}</span>,
        code: (props: any) => {
          const { inline, children } = props;
          if (inline) {
            return (
              <code className="bg-gray-700 px-1 py-[2px] rounded text-green-300 font-mono">
                {children}
              </code>
            );
          } else {
            return (
              <pre className="bg-gray-800 p-3 rounded text-green-300 overflow-x-auto font-mono">
                <code>{children}</code>
              </pre>
            );
          }
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
