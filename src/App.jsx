import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
} from "./components";
import MarioKartGame from "./components/MarioKartGame";

const App = () => {
  return (
    <Router>
      <div className="relative z-0 bg-primary">
        <Routes>
          {/* Main Portfolio Route */}
          <Route
            path="/"
            element={
              <>
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
              </>
            }
          />

          {/* Game Route */}
          <Route path="/game" element={<MarioKartGame />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
