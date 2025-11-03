import Layout from "@components/layout/Layout";
import PageWrapper from "@components/layout/PageWrapper";
import ThreeBackground from "@components/ui/ThreeBackground";
import { motion } from "framer-motion";
import { useTypingEffect } from "@hooks/useTypingEffect";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const sections = [
  { id: "projects", label: "Projets", route: "/visualization" },
  { id: "skills", label: "Compétences", route: "/skills" },
  { id: "experience", label: "Expériences", route: "/experience" },
  { id: "education", label: "Formations", route: "/education" },
];

const Home: React.FC = () => {
  const typedText = useTypingEffect("Salut, moi c’est Clément", 80);
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleNavigate = async (to: string) => {
    if (isExiting) return;
    setIsExiting(true);

    if (to === "/visualization") {
      import("@pages/Visualization");
    } else if (to === "/") {
      import("@pages/Home");
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    navigate(to);
  };

  return (
    <Layout>
      <PageWrapper zoom="in" animateExit={isExiting}>
        <section className="relative flex flex-col items-center justify-center w-full min-h-[calc(100vh-64px)] text-center overflow-hidden px-fluid-4">
          <div className="absolute inset-0 z-0">
            <ThreeBackground />
          </div>

          <motion.h1
            className="text-fluid-5xl sm:text-fluid-6xl md:text-fluid-4xl font-bold mb-fluid-3 text-accent flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span>{typedText}</span>
            <span className="ml-1 w-1 h-10 bg-accent animate-pulse"></span>
          </motion.h1>

          <motion.p
            className="text-text-muted text-fluid-base sm:text-fluid-lg max-w-2xl mb-fluid-4 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Étudiant en informatique à la recherche d’un{" "}
            <span className="text-accent font-semibold">stage de fin d’études</span>.
            <br />
            Passionné par le développement web, les systèmes intelligents et le design fonctionnel.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-fluid-4 mt-fluid-2 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => handleNavigate(sec.route)}
                className="px-fluid-6 py-fluid-2 rounded-full border border-[#333] text-text-main hover:border-accent hover:text-accent transition-all duration-300 bg-card shadow-md text-fluid-base md:text-fluid-lg"
              >
                {sec.label}
              </button>
            ))}
          </motion.div>
        </section>
      </PageWrapper>
    </Layout>
  );
};

export default Home;
