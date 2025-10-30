import Layout from "@components/layout/Layout";
import Capsule from "@components/ui/Capsule";
import { motion } from "framer-motion";
import { useTypingEffect } from "@hooks/useTypingEffect";
import ThreeBackground from "@components/ui/ThreeBackground";

const sections = [
  { id: "projects", label: "Projets", route: "/projects" },
  { id: "skills", label: "Compétences", route: "/skills" },
  { id: "experience", label: "Expériences", route: "/experience" },
  { id: "education", label: "Formations", route: "/education" },
];

const Home = () => {
  const typedText = useTypingEffect("Salut, moi c’est Clément", 80);

  return (
    <Layout>
      <section className="relative flex flex-col items-center justify-center w-full min-h-[calc(100vh-64px)] text-center overflow-hidden">
        {/* Fond Three.js full screen */}
        <div className="absolute inset-0 z-0">
          <ThreeBackground />
        </div>

        {/* Présentation */}
        <motion.h1
          className="text-6xl font-bold mb-6 text-[var(--accent)] flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span>{typedText}</span>
          <span className="ml-1 w-1 h-10 bg-[var(--accent)] animate-pulse"></span>
        </motion.h1>

        <motion.p
          className="text-gray-300 text-lg max-w-2xl mb-16 z-10 px-4 sm:px-6 md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Étudiant en informatique à la recherche d’un{" "}
          <span className="text-[var(--accent)] font-semibold">stage de fin d’études</span>.<br />
          Passionné par le développement web, les systèmes intelligents et le design fonctionnel.
        </motion.p>

        {/* Capsules de navigation */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-6 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {sections.map((sec) => (
            <Capsule key={sec.id} label={sec.label} to={sec.route} />
          ))}
        </motion.div>
      </section>
    </Layout>
  );
};

export default Home;
