import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import IssuePage from './pages/IssuePage.tsx';
import VerifyPage from './pages/VerifyPage.tsx';
import HomePage from './pages/HomePage.tsx';
import HealthPage from './pages/HealthPage.tsx';

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
    >
      <div
        className={`
          flex items-center justify-center gap-6 px-6 py-3 rounded-2xl border transition-all duration-300
          ${
            isScrolled
              ? "bg-black/90 backdrop-blur-xl border-gray-800/40 shadow-2xl"
              : "bg-black/95 backdrop-blur-lg border-gray-800/30 shadow-lg"
          }
        `}
      >
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="relative text-gray-300 hover:text-white transition-all duration-300 group px-3 py-1 rounded-lg hover:bg-white/5 transform hover:scale-110 hover:rotate-1 hover:skew-x-1"
          >
            Home
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-4"></span>
          </Link>
          <Link
            to="/issue"
            className="relative text-gray-300 hover:text-white transition-all duration-300 group px-3 py-1 rounded-lg hover:bg-white/5 transform hover:scale-110 hover:-rotate-1 hover:-skew-x-1"
          >
            Issue Credential
            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-4"></span>
          </Link>
          <Link
            to="/verify"
            className="relative text-gray-300 hover:text-white transition-all duration-300 group px-3 py-1 rounded-lg hover:bg-white/5 transform hover:scale-110 hover:rotate-1 hover:skew-x-1"
          >
            Verify Credential
          </Link>
          <Link
            to="/health"
            className="relative text-gray-300 hover:text-white transition-all duration-300 group px-3 py-1 rounded-lg hover:bg-white/5 transform hover:scale-110 hover:-rotate-1 hover:-skew-x-1"
          >
            Service Health
          </Link>
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navigation />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/issue" element={<IssuePage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/health" element={<HealthPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;