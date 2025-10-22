// src/components/Card.tsx
import React from "react";
import type { ProjectRead } from "../api/project";
import { motion } from "framer-motion";

interface CardProps {
  project: ProjectRead;
}

const Card: React.FC<CardProps> = ({ project }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 hover:shadow-xl transition-shadow duration-300"
      whileHover={{ scale: 1.03 }}
    >
      {project.image_url && (
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      {project.description && <p className="text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>}
      {project.tech_stack && <p className="text-sm text-gray-500 mb-2">{project.tech_stack}</p>}
      <div className="flex gap-4 mt-2">
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            GitHub
          </a>
        )}
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-green-500">
            Live
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
