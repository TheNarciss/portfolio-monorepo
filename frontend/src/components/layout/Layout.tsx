import React from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-200 font-mono transition-colors">
      <Navbar />
      <main className="flex-1 mt-24">{children}</main>
      <footer className="text-center py-4 mt-10 border-t border-gray-800 text-sm font-code text-gray-500">
        <span className="text-[var(--accent)]">[root]</span> © {new Date().getFullYear()} Clément — Portfolio v1.0
      </footer>
    </div>
  );
};

export default Layout;
