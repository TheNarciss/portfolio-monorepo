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

const Card: React.FC<CardProps> = ({ title, description, image_url, tech_stack, github_url, live_url }) => {
  return (
    <motion.div
      className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col shadow-md hover:shadow-xl transition-transform duration-300"
      whileHover={{ scale: 1.03 }}
    >
      {image_url && (
        <img src={image_url} alt={title} className="w-full h-48 object-cover rounded-lg mb-4" />
      )}
      <h3 className="text-xl font-semibold mb-2 text-green-400">{title}</h3>
      {description && <p className="text-gray-300 mb-2">{description}</p>}
      {tech_stack && <p className="text-sm text-gray-500 mb-2">{tech_stack}</p>}
      <div className="flex gap-4 mt-auto">
        {github_url && (
          <a href={github_url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
            GitHub
          </a>
        )}
        {live_url && (
          <a href={live_url} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
            Live
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
