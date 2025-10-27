import React, { useEffect, useState } from "react";
import type { EducationRead } from "../api/education";
import { fetchEducations } from "../api/education";
import Card from "../components/ui/Card";

const EducationPage: React.FC = () => {
  const [educations, setEducations] = useState<EducationRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEducations = async () => {
      try {
        const data = await fetchEducations();
        setEducations(data);
      } catch {
        setError("Erreur lors du chargement des formations.");
      } finally {
        setLoading(false);
      }
    };
    loadEducations();
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {educations.map((edu) => (
        <Card
          key={edu.id}
          title={edu.degree} // utilisation du champ existant
          description={edu.description}
          image_url={undefined} // pas de champ image dans EducationRead
          tech_stack={`${edu.school ?? ""} • ${edu.start_date ? new Date(edu.start_date).getFullYear() : ""} - ${edu.end_date ? new Date(edu.end_date).getFullYear() : "Présent"}`}
        />
      ))}
    </div>
  );
};

export default EducationPage;
