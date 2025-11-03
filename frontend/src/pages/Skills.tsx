import React, { useEffect, useState } from "react";
import type { SkillRead } from "../api/skill";
import { fetchSkills } from "../api/skill";
import Card from "../components/ui/Card";

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<SkillRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await fetchSkills();
        setSkills(data);
      } catch {
        setError("Erreur lors du chargement des compétences.");
      } finally {
        setLoading(false);
      }
    };
    loadSkills();
  }, []);

  if (loading) return <p className="text-center mt-fluid-4 text-fluid-base">Chargement...</p>;
  if (error) return <p className="text-center mt-fluid-4 text-red-500 text-fluid-base">{error}</p>;

  return (
    <div className="container mx-auto px-fluid-4 py-fluid-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-4">
      {skills.map((skill) => (
        <Card
          key={skill.id}
          title={skill.name}
          tech_stack={skill.category ? `Catégorie: ${skill.category}` : undefined}
          description={skill.level ? `Niveau: ${skill.level}` : undefined}
          image_url={undefined}
        />
      ))}
    </div>
  );
};

export default SkillsPage;
