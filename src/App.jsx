import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
  Interactive,
} from "./components";

import React from "react";

const MainLayout = () => (
  <div className="relative z-0 bg-primary">
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
      <Navbar />
      <Hero />
    </div>
    <About />
    <Experience />
    <Tech />
    <Works />
    <div className="relative z-0">
      <Contact />
      <StarsCanvas />
    </div>
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  const isInteractivePage = location.pathname === "/interactive";

  return (
    <>
      <Routes>
        <Route path="/interactive" element={<Interactive />} />
        {/* Define other routes here if needed */}
      </Routes>

      {/* Show main layout only when NOT on /interactive */}
      {!isInteractivePage && <MainLayout />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
