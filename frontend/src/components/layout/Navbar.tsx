// src/components/layout/Navbar.tsx
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
];

const Navbar = () => {
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let l of links) {
        const el = document.getElementById(l.id);
        if (el && scrollPos >= el.offsetTop) setActive(l.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-bg/80 backdrop-blur-md border-b border-[#333] shadow-[0_2px_8px_rgba(0,0,0,0.5)] z-50">
      <div className="max-w-7xl mx-auto px-fluid-4 py-fluid-4 flex justify-between items-center">
        <div className="text-fluid-2xl font-bold text-accent">Portfolio</div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex gap-fluid-10">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`relative px-fluid-2 py-fluid-1 font-mono transition-colors ${
                  active === link.id
                    ? "text-accent after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-accent"
                    : "text-text-muted hover:text-accent"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Burger Mobile */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden text-text-main focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-bg/95 backdrop-blur-xl border-t border-[#333] animate-fadeIn">
          <ul className="flex flex-col items-center gap-fluid-6 py-fluid-8">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-fluid-base font-mono transition-colors ${
                    active === link.id ? "text-accent" : "text-text-main hover:text-accent"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
