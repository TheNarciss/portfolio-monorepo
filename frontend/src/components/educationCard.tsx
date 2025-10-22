import React from "react";
import type { EducationRead } from "../api/education";
import { motion } from "framer-motion";

interface EducationCardProps {
  edu: EducationRead;
}

const EducationCard: React.FC<EducationCardProps> = ({ edu }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 hover:shadow-xl transition-shadow duration-300"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-lg font-semibold mb-1">{edu.degree}</h3>
      {edu.school && <p className="text-gray-600 dark:text-gray-300">{edu.school}</p>}
      {edu.start_date && <p className="text-sm text-gray-500">{edu.start_date} - {edu.end_date ?? "Present"}</p>}
      {edu.description && <p className="mt-2 text-gray-700 dark:text-gray-200">{edu.description}</p>}
    </motion.div>
  );
};

export default EducationCard;
