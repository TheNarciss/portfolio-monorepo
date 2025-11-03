import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "@pages/Home";
import Visualization from "@pages/Visualization";

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/visualization" element={<Visualization />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRouter: React.FC = () => (
  <Router>
    <AnimatedRoutes />
  </Router>
);

export default AppRouter;
