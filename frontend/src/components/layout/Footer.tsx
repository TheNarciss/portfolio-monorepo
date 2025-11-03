// src/components/layout/Footer.tsx

const Footer = () => {
  return (
    <footer className="bg-card text-text-muted text-center py-fluid-8 border-t border-white/20 text-fluid-sm md:text-fluid-base">
      <span className="text-accent font-mono">© {new Date().getFullYear()}</span> Mon Portfolio. All rights reserved.
    </footer>
  );
};

export default Footer;
