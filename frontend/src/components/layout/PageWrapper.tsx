// src/components/layout/PageWrapper.tsx
import { motion } from "framer-motion";
import React from "react";
import type { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  zoom?: "in" | "out";
  animateExit?: boolean;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  zoom = "in",
  animateExit = false,
}) => {
  const baseVariants =
    zoom === "in"
      ? {
          initial: { opacity: 0, scale: 0.9 },
          in: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 },
        }
      : {
          initial: { opacity: 0, scale: 1.1 },
          in: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
        };

  return (
    <motion.div
      initial="initial"
      animate={animateExit ? "exit" : "in"}
      exit="exit"
      variants={baseVariants}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="w-full min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
