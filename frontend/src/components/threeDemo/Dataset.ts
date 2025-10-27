// src/components/threeDemo/Dataset.ts

export interface Node {
  id: string;
  name: string;
  category?: string;
  position: [number, number, number];
}

export interface Link {
  source: string;
  target: string;
}

export const nodes: Node[] = [
  // 🧠 Compétences techniques (Skill)
  { id: "python", name: "Python", category: "Skill", position: [2, 3, 0] },
  { id: "fastapi", name: "FastAPI", category: "Skill", position: [3, 2, -1] },
  { id: "react", name: "React", category: "Skill", position: [-2, 3, 1] },
  { id: "nodejs", name: "Node.js", category: "Skill", position: [3, -1, -2] },
  { id: "postgresql", name: "PostgreSQL", category: "Skill", position: [-2, -1, 2] },
  { id: "docker", name: "Docker", category: "Skill", position: [-3, 0, 0] },
  { id: "faiss", name: "FAISS", category: "Skill", position: [2, -1, 2] },
  { id: "llm", name: "LLM", category: "Skill", position: [3, 1, 3] },
  { id: "swiftui", name: "SwiftUI", category: "Skill", position: [1, -3, -1] },
  { id: "sql", name: "SQL", category: "Skill", position: [0, -2, 1] },
  { id: "csharp", name: "C#", category: "Skill", position: [-1, 2, -1] },
  { id: "vba", name: "VBA", category: "Skill", position: [-1, 1, -2] },
  { id: "solidworks", name: "SolidWorks", category: "Skill", position: [-3, 2, 0] },
  { id: "3dprinting", name: "3D Printing", category: "Skill", position: [-3, -1, 1] },
  { id: "ml", name: "Machine Learning", category: "Skill", position: [2, 0, 2] },

  // 🎓 Formations / Stages (Education)
  { id: "esilv", name: "E.S.I.L.V.", category: "Education", position: [-4, 2, -2] },
  { id: "msc_esilv", name: "MSc E.S.I.L.V.", category: "Education", position: [-4, -1, 2] },
  { id: "imperial", name: "Imperial College London", category: "Education", position: [3, -2, 1] },

  // 💼 Expériences (Work)
  { id: "acoss", name: "A.C.O.S.S.", category: "Work", position: [0, 0, 4] },
  { id: "creative", name: "Creative Commerce", category: "Work", position: [-2, -3, 0] },

  // 🚀 Projets (Project)
  { id: "disease_ai", name: "Disease Diagnosis App", category: "Project", position: [2, 2, -1] },
  { id: "connect4_ai", name: "Connect 4 AI", category: "Project", position: [-2, 2, 1] },
  { id: "prototype", name: "Prototype Dirigible", category: "Project", position: [-3, 0, 1] },
  { id: "legal_assistant", name: "AI Legal Assistant", category: "Project", position: [1, 1, 3] },
  { id: "ecg", name: "ECG Analysis", category: "Project", position: [3, 1, -1] },
];

export const links: Link[] = [
  // 🔗 A.C.O.S.S.
  { source: "acoss", target: "python" },
  { source: "acoss", target: "fastapi" },
  { source: "acoss", target: "react" },
  { source: "acoss", target: "nodejs" },
  { source: "acoss", target: "postgresql" },
  { source: "acoss", target: "llm" },
  { source: "acoss", target: "faiss" },
  { source: "acoss", target: "legal_assistant" },

  // 🔗 Imperial / Education
  { source: "imperial", target: "python" },
  { source: "imperial", target: "csharp" },
  { source: "imperial", target: "vba" },
  { source: "imperial", target: "ml" },
  { source: "imperial", target: "ecg" },

  // 🔗 Creative Commerce
  { source: "creative", target: "docker" },
  { source: "creative", target: "sql" },

  // 🔗 Disease Diagnosis App
  { source: "disease_ai", target: "python" },
  { source: "disease_ai", target: "sql" },
  { source: "disease_ai", target: "swiftui" },
  { source: "disease_ai", target: "ml" },

  // 🔗 Connect 4 AI
  { source: "connect4_ai", target: "csharp" },
  { source: "connect4_ai", target: "vba" },
  { source: "connect4_ai", target: "ml" },

  // 🔗 Prototype Dirigible
  { source: "prototype", target: "solidworks" },
  { source: "prototype", target: "3dprinting" },

  // 🔗 Legal Assistant
  { source: "legal_assistant", target: "python" },
  { source: "legal_assistant", target: "fastapi" },
  { source: "legal_assistant", target: "react" },
  { source: "legal_assistant", target: "postgresql" },
  { source: "legal_assistant", target: "llm" },
  { source: "legal_assistant", target: "faiss" },

  // 🔗 ECG Analysis
  { source: "ecg", target: "python" },
  { source: "ecg", target: "ml" },

  // 🔗 Education
  { source: "esilv", target: "python" },
  { source: "esilv", target: "react" },
  { source: "esilv", target: "docker" },
  { source: "esilv", target: "ml" },
  { source: "msc_esilv", target: "python" },
  { source: "msc_esilv", target: "csharp" },
  { source: "msc_esilv", target: "sql" },
  { source: "msc_esilv", target: "react" },

  // 🔗 Liens supplémentaires entre compétences pour densité
  { source: "python", target: "ml" },
  { source: "python", target: "sql" },
  { source: "react", target: "nodejs" },
  { source: "nodejs", target: "postgresql" },
  { source: "solidworks", target: "3dprinting" },
  { source: "llm", target: "faiss" },
];
