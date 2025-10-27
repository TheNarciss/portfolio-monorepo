import { useState, useEffect } from "react";

const links = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
];

const Navbar = () => {
  const [active, setActive] = useState("");

  const handleScroll = () => {
    const scrollPos = window.scrollY + 200; 
    for (let l of links) {
      const el = document.getElementById(l.id);
      if (el && scrollPos >= el.offsetTop) setActive(l.id);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed w-full bg-black/90 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center flex-wrap">
        <div className="text-2xl font-bold text-green-400">Portfolio</div>
        <ul className="flex gap-6 flex-wrap">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`relative px-2 py-1 font-mono transition-colors ${
                  active === link.id 
                    ? "text-green-400 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-green-400" 
                    : "text-gray-400 hover:text-green-400"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
