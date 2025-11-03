import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api/project";
import type { ProjectRead } from "../api/project";
import Card from "../components/ui/Card";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch {
        setError("Erreur lors du chargement des projets.");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  if (loading) return <p className="text-center mt-fluid-4 text-fluid-base">Chargement...</p>;
  if (error) return <p className="text-center mt-fluid-4 text-red-500 text-fluid-base">{error}</p>;

  return (
    <div className="container mx-auto px-fluid-4 py-fluid-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-fluid-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          title={project.title}
          description={project.description}
          tech_stack={project.tech_stack}
          github_url={project.github_url}
          live_url={project.live_url}
          image_url={project.image_url}
        />
      ))}
    </div>
  );
};

export default Projects;
