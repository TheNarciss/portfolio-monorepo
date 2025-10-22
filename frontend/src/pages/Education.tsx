import React, { useEffect, useState } from "react";
import type { EducationRead } from "../api/education";
import { fetchEducations } from "../api/education";
import EducationCard from "../components/educationCard";

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
      {educations.map((edu) => <EducationCard key={edu.id} edu={edu} />)}
    </div>
  );
};

export default EducationPage;
