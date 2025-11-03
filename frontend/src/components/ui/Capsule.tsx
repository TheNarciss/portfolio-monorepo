import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface CapsuleProps {
  label: string;
  to: string;
}

const Capsule: React.FC<CapsuleProps> = ({ label, to }) => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Préchargement du composant cible
    import(`@pages${to === "/visualization" ? "/Visualization" : "/Home"}`);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    navigate(to);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isAnimating}
      className="px-fluid-6 py-fluid-2 rounded-full border border-[#333] text-text-main 
                 hover:border-accent hover:text-accent transition-all duration-300 
                 bg-card shadow-md text-fluid-base md:text-fluid-lg"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  );
};

export default Capsule;
