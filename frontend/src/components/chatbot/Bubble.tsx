import React from "react";
import { useTypingEffect } from "@hooks/useTypingEffect";
import MarkdownRenderer from "./MarkdownRenderer";

interface BubbleProps {
  text: string;
  author: "user" | "bot";
  isTyping?: boolean;
}

const Bubble: React.FC<BubbleProps> = ({ text, author, isTyping }) => {
  const typedText = useTypingEffect(text, author === "user" ? 10 : 20);

  return (
    <div
      className={`
        p-3 rounded-lg shadow-md 
        max-w-[80%] sm:max-w-[70%] md:max-w-[60%]
        ${author === "user"
          ? "bg-accent text-gray-900 rounded-tr-none ml-auto"
          : "bg-card text-white rounded-tl-none mr-auto"
        }
      `}
    >
      {!isTyping ? <MarkdownRenderer content={typedText} /> : <span>...</span>}
    </div>
  );
};

export default Bubble;
