import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  description?: string;
  image_url?: string;
  tech_stack?: string;
  github_url?: string;
  live_url?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  image_url,
  tech_stack,
  github_url,
  live_url,
}) => {
  return (
    <motion.div
      className="bg-card border border-[#333] rounded-xl p-fluid-4 flex flex-col shadow-md hover:shadow-xl transition-transform duration-300 w-full max-w-sm"
      whileHover={{ scale: 1.03 }}
    >
      {image_url && (
        <img
          src={image_url}
          alt={title}
          className="w-full h-48 object-cover rounded-lg mb-fluid-2"
        />
      )}
      <h3 className="text-fluid-lg font-semibold mb-fluid-1 text-accent">{title}</h3>
      {description && <p className="text-text-muted mb-fluid-1">{description}</p>}
      {tech_stack && <p className="text-sm text-text-muted mb-fluid-1">{tech_stack}</p>}
      <div className="flex gap-fluid-2 mt-auto">
        {github_url && (
          <a href={github_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-fluid-sm md:text-fluid-base">
            GitHub
          </a>
        )}
        {live_url && (
          <a href={live_url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-fluid-sm md:text-fluid-base">
            Live
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default Card;