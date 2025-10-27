import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface CapsuleProps {
  label: string;
  to: string;
}

const Capsule: React.FC<CapsuleProps> = ({ label, to }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(to)}
      className="px-6 py-3 rounded-full border border-gray-700 text-[var(--text-main)] 
                 hover:border-[var(--accent)] hover:text-[var(--accent)] 
                 transition-all duration-300 bg-[var(--bg-card)] shadow-md"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  );
};

export default Capsule;
