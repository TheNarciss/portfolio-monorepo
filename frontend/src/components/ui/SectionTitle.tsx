import React from "react";

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <h2 className="text-fluid-2xl md:text-fluid-3xl font-bold text-center mb-fluid-2 text-text-main">
      {title}
    </h2>
  );
};

export default SectionTitle;
