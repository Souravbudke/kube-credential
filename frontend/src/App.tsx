import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FileText, CheckCircle, Home, Server, Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import IssuePage from './pages/IssuePage';
import VerifyPage from './pages/VerifyPage';
import HomePage from './pages/HomePage';
import HealthPage from './pages/HealthPage';

function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/issue', label: 'Issue Credential', icon: FileText },
    { path: '/verify', label: 'Verify Credential', icon: CheckCircle },
    { path: '/health', label: 'Service Health', icon: Server },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Kube Credential
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Secure Credential Management</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Button
                  key={path}
                  variant={location.pathname === path ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={`transition-all duration-200 ${
                    location.pathname === path
                      ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-md hover:shadow-lg"
                      : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Link
                    to={path}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                </Button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white/95 backdrop-blur-xl">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <Button
                    key={path}
                    variant={location.pathname === path ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start transition-all duration-200 ${
                      location.pathname === path
                        ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white"
                        : "hover:bg-gray-50"
                    }`}
                    asChild
                  >
                    <Link
                      to={path}
                      className="flex items-center space-x-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-purple-50/30">
        <Navigation />
        <main className="container mx-auto py-8 px-4">
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