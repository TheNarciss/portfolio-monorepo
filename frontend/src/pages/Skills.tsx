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

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill) => (
        <Card
          key={skill.id}
          title={skill.name} // <-- champ name
          tech_stack={skill.category ? `Catégorie: ${skill.category}` : undefined} // optionnel
          description={skill.level ? `Niveau: ${skill.level}` : undefined} // optionnel
          image_url={undefined}
        />
      ))}
    </div>
  );
};

export default SkillsPage;
