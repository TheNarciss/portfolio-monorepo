import React from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex flex-col w-screen min-h-screen bg-bg text-text-main font-mono overflow-x-hidden">
      <Navbar />

      <main className="relative z-10 flex-1 flex flex-col w-full px-fluid-4 py-fluid-8 md:px-fluid-8 md:py-fluid-12">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
