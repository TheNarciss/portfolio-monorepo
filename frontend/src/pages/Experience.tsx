import React, { useEffect, useState } from "react";
import type { ExperienceRead } from "../api/experience";
import { fetchExperiences } from "../api/experience";
import Card from "../components/ui/Card";

const ExperiencePage: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await fetchExperiences();
        setExperiences(data);
      } catch {
        setError("Erreur lors du chargement des expériences.");
      } finally {
        setLoading(false);
      }
    };
    loadExperiences();
  }, []);

  if (loading) return <p className="text-center mt-fluid-4 text-fluid-base">Chargement...</p>;
  if (error) return <p className="text-center mt-fluid-4 text-red-500 text-fluid-base">{error}</p>;

  return (
    <div className="container mx-auto px-fluid-4 py-fluid-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-4">
      {experiences.map((exp) => (
        <Card
          key={exp.id}
          title={exp.title}
          description={exp.description ?? undefined}
          tech_stack={`${exp.company ?? ""} • ${exp.start_date ? new Date(exp.start_date).getFullYear() : ""} - ${exp.end_date ? new Date(exp.end_date).getFullYear() : "Présent"}`}
          image_url={undefined}
        />
      ))}
    </div>
  );
};

export default ExperiencePage;
