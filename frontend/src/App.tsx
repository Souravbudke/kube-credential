import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import IssuePage from './pages/IssuePage.tsx';
import VerifyPage from './pages/VerifyPage.tsx';
import HomePage from './pages/HomePage.tsx';
import HealthPage from './pages/HealthPage.tsx';

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <>
      <header
        className={`
          fixed top-4 left-4 right-4 z-50 transition-all duration-300 ease-in-out
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <div
          className={`
            flex items-center justify-center gap-6 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border transition-all duration-300 relative
            ${
              isScrolled
                ? "bg-black/90 backdrop-blur-xl border-gray-800/40 shadow-2xl"
                : "bg-black/95 backdrop-blur-lg border-gray-800/30 shadow-lg"
            }
          `}
        >
          {/* Mobile Menu Button - Upper Left Corner */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors absolute left-2 top-1/2 transform -translate-y-1/2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>

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

          {/* Mobile Navigation */}
          <nav
            className={`
              absolute top-full left-0 mt-2 p-4 rounded-xl border bg-black/95 backdrop-blur-lg border-gray-800/30 shadow-lg transition-all duration-300 md:hidden w-64
              ${isMobileMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}
            `}
          >
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Home
              </Link>
              <Link
                to="/issue"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Issue Credential
              </Link>
              <Link
                to="/verify"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Verify Credential
              </Link>
              <Link
                to="/health"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Service Health
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
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