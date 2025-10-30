import React from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";



interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex flex-col w-screen min-h-screen bg-[var(--bg)] text-gray-200 font-mono overflow-hidden">
      <Navbar />

      {/* Contenu */}
      <main className="relative z-10 flex-1 flex flex-col w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 border-t border-gray-800 text-sm font-code text-gray-500">
        <span className="text-[var(--accent)]">[root]</span> © {new Date().getFullYear()} Clément — Portfolio v1.0
      </footer>
    </div>
  );
};

export default Layout;
