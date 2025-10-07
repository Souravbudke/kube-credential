import {
  FileText,
  CheckCircle,
  Server,
  ArrowRight,
  Shield,
  Database,
  Sparkles,
  Globe,
  Activity,
  Zap,
  Target,
  Layers,
  Cpu,
  ChevronRight,
  Star,
  Palette,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: 'Issue Credentials',
      description: 'Create and issue new digital credentials with proper validation and worker tracking.',
      href: '/issue',
      gradient: 'from-blue-600 via-cyan-600 to-teal-600',
      iconBg: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-600',
      features: ['Structured data entry', 'Unique ID generation', 'Worker audit trails', 'Duplicate prevention'],
      stats: '2.1K+',
      statLabel: 'Credentials Issued'
    },
    {
      icon: CheckCircle,
      title: 'Verify Credentials',
      description: 'Validate the authenticity and integrity of issued credentials.',
      href: '/verify',
      gradient: 'from-emerald-600 via-green-600 to-teal-600',
      iconBg: 'bg-gradient-to-br from-emerald-500/10 to-green-500/10',
      iconColor: 'text-emerald-600',
      features: ['Cross-service validation', 'Data integrity checks', 'Verification history', 'Real-time verification'],
      stats: '99.9%',
      statLabel: 'Verification Accuracy'
    },
    {
      icon: Server,
      title: 'Service Health',
      description: 'Monitor the health and performance of all microservices.',
      href: '/health',
      gradient: 'from-purple-600 via-violet-600 to-indigo-600',
      iconBg: 'bg-gradient-to-br from-purple-500/10 to-violet-500/10',
      iconColor: 'text-purple-600',
      features: ['Real-time monitoring', 'Service status', 'Worker information', 'System metrics'],
      stats: '<100ms',
      statLabel: 'Response Time'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime SLA', icon: Activity, color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: '<100ms', label: 'Global Latency', icon: Zap, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { value: '2x', label: 'Auto Scaling', icon: Layers, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { value: '100%', label: 'Audit Trail', icon: Shield, color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ];

  const technologies = [
    { name: 'Node.js', category: 'Runtime', icon: Server },
    { name: 'TypeScript', category: 'Language', icon: Code },
    { name: 'React', category: 'Frontend', icon: Globe },
    { name: 'Docker', category: 'Container', icon: Layers },
    { name: 'Kubernetes', category: 'Orchestration', icon: Cpu },
    { name: 'SQLite', category: 'Database', icon: Database },
    { name: 'Tailwind CSS', category: 'Styling', icon: Palette },
    { name: 'shadcn/ui', category: 'Components', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.02)_50%,transparent_75%,transparent)] bg-[length:250px_250px] bg-[position:0_0,125px_125px]" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-blue-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-radial from-cyan-400/10 via-teal-400/5 to-transparent rounded-full blur-3xl animate-pulse" />

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-float" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center space-y-6 sm:space-y-8 lg:space-y-12">
            {/* Premium Badge */}
            <div className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-slate-700 rounded-full text-xs sm:text-sm font-semibold border border-slate-200/60 backdrop-blur-sm shadow-lg">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-500 fill-current" />
              <span className="mr-2">⭐</span>
              Enterprise-Grade Credential Management Platform
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </div>

            {/* Main heading */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
                <span className="block text-slate-900 mb-1 sm:mb-2">Kube</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                  Credential
                </span>
                <span className="block text-slate-900">Platform</span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light px-4 sm:px-0">
                The next-generation, cloud-native platform for issuing, verifying, and managing
                <span className="font-semibold text-slate-900"> digital credentials </span>
                with enterprise-grade security and infinite scalability.
              </p>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4 sm:pt-6 lg:pt-8">
              <Button size="lg" asChild className="group bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl font-semibold border-0 hover:scale-105 w-full sm:w-auto">
                <Link to="/issue" className="flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                  Issue Credential
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="group border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-500 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl font-semibold hover:scale-105 w-full sm:w-auto">
                <Link to="/verify" className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                  Verify Credential
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Modern Card Design */}
      <div className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-white/50 to-slate-50/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Complete Feature Suite
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 lg:mb-8">
              Everything You Need
            </h2>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-600 max-w-4xl mx-auto px-4 sm:px-0 leading-relaxed">
              Comprehensive credential management with advanced features designed for modern enterprises
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
            {features.map(({ icon: Icon, title, description, href, gradient, iconBg, iconColor, features, stats, statLabel }) => (
              <div key={title} className="group relative">
                {/* Main card container */}
                <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border border-slate-200/50 hover:scale-[1.02]">

                  {/* Gradient accent bar */}
                  <div className={`h-1 bg-gradient-to-r ${gradient} w-full`} />

                  {/* Card content */}
                  <div className="p-6 sm:p-8">
                    {/* Header with icon and stats */}
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      <div className={`relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${iconBg} border border-slate-200/50 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor}`} />
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl sm:rounded-2xl`} />
                      </div>

                      {/* Stats badge */}
                      <div className="text-right">
                        <div className={`bg-gradient-to-r ${gradient} text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold`}>
                          {stats}
                        </div>
                        <div className="text-xs text-slate-600 font-medium mt-1 hidden sm:block">{statLabel}</div>
                      </div>
                    </div>

                    {/* Title and description */}
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-slate-800 transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="mb-6 sm:mb-8">
                      <ul className="space-y-2 sm:space-y-3">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-xs sm:text-sm text-slate-700">
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r ${gradient} rounded-full mr-2 sm:mr-3 flex-shrink-0`} />
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Button asChild className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 py-4 sm:py-5 lg:py-6 text-sm sm:text-base font-semibold hover:scale-[1.02]`}>
                      <Link to={href} className="flex items-center justify-center">
                        <span>Get Started</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>

                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Stats Section */}
      <div className="py-16 sm:py-24 lg:py-32 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.02)_50%,transparent_75%,transparent)] bg-[length:60px_60px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
              Trusted by <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Enterprises</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto px-4 sm:px-0">
              Delivering exceptional performance and reliability at scale
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map(({ value, label, icon: Icon, color, bgColor }) => (
              <div key={label} className="text-center group">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 ${bgColor} rounded-2xl sm:rounded-3xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                  <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${color}`} />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  {value}
                </div>
                <div className="text-slate-400 font-semibold text-sm sm:text-base lg:text-lg">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack - Modern Grid */}
      <div className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Cpu className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Modern Tech Stack
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-4 sm:mb-6 lg:mb-8">
              Built for the Future
            </h2>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-slate-600 max-w-4xl mx-auto px-4 sm:px-0">
              Leveraging cutting-edge technologies to deliver unmatched performance and developer experience
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {technologies.map(({ name, category, icon: Icon }) => (
              <div key={name} className="group bg-gradient-to-br from-slate-50 to-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl sm:rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">{name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
