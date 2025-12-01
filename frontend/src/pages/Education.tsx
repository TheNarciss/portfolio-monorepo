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

  if (loading) return <p className="text-center mt-fluid-4 text-fluid-base">Chargement...</p>;
  if (error) return <p className="text-center mt-fluid-4 text-red-500 text-fluid-base">{error}</p>;

  return (
    <div className="container mx-auto px-fluid-4 py-fluid-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-4 ">
      {educations.map((edu) => (
        <Card
          key={edu.id}
          title={edu.degree}
          description={edu.description}
          image_url={undefined}
          tech_stack={`${edu.school ?? ""} • ${edu.start_date ? new Date(edu.start_date).getFullYear() : ""} - ${edu.end_date ? new Date(edu.end_date).getFullYear() : "Présent"}`}
        />
      ))}
    </div>
  );
};

export default EducationPage;
