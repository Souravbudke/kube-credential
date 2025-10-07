import { FileText, CheckCircle, Server, Users, ArrowRight, Shield, Database, Cloud, Sparkles, Globe, Lock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: 'Issue Credentials',
      description: 'Create and issue new digital credentials with proper validation and worker tracking.',
      href: '/issue',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      iconColor: 'text-white',
      details: ['Structured data entry', 'Unique ID generation', 'Worker audit trails', 'Duplicate prevention']
    },
    {
      icon: CheckCircle,
      title: 'Verify Credentials',
      description: 'Validate the authenticity and integrity of issued credentials.',
      href: '/verify',
      color: 'bg-gradient-to-br from-emerald-500 to-green-600',
      iconColor: 'text-white',
      details: ['Cross-service validation', 'Data integrity checks', 'Verification history', 'Real-time verification']
    },
    {
      icon: Server,
      title: 'Service Health',
      description: 'Monitor the health and performance of all microservices.',
      href: '/health',
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      iconColor: 'text-white',
      details: ['Real-time monitoring', 'Service status', 'Worker information', 'System metrics']
    }
  ];

  const architectureItems = [
    {
      icon: Database,
      title: 'Issuance Service',
      description: 'Handles credential creation, storage, and retrieval with SQLite persistence.',
      tech: ['Node.js', 'TypeScript', 'SQLite', 'Express']
    },
    {
      icon: Shield,
      title: 'Verification Service',
      description: 'Cross-validates credentials and tracks verification history.',
      tech: ['Node.js', 'TypeScript', 'REST API', 'Validation']
    },
    {
      icon: Users,
      title: 'React Frontend',
      description: 'User-friendly interface with real-time feedback and modern design.',
      tech: ['React', 'TypeScript', 'Tailwind', 'shadcn/ui']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-purple-50" />
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] [background-size:60px_60px]" />
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-cyan-600/20 rounded-full blur-3xl" />

        <div className="relative text-center space-y-8 py-20 px-4">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-100 to-purple-100 text-cyan-800 rounded-full text-sm font-medium border border-cyan-200/50">
            <Sparkles className="w-4 h-4 mr-2" />
            Microservice-based Architecture
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-gray-900">Kube</span>
              <span className="gradient-text"> Credential</span>
              <br />
              <span className="text-gray-900">Management</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A scalable, secure platform for issuing and verifying digital credentials
              with enterprise-grade architecture and comprehensive audit trails.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/issue" className="flex items-center px-8">
                <FileText className="w-5 h-5 mr-2" />
                Issue Credential
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2 hover:bg-gray-50 transition-all duration-300">
              <Link to="/verify" className="flex items-center px-8">
                <CheckCircle className="w-5 h-5 mr-2" />
                Verify Credential
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid lg:grid-cols-3 gap-8 px-4">
        {features.map(({ icon: Icon, title, description, href, color, iconColor, details }) => (
          <Card key={title} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${color} shadow-lg`}>
                  <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-base leading-relaxed text-gray-600">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {details.map((detail, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mr-3 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full mt-6 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-0 text-gray-700 hover:text-gray-900 transition-all duration-300">
                <Link to={href} className="flex items-center justify-center">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Architecture Section */}
      <div className="space-y-12 px-4">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50 px-4 py-2">
            <Cloud className="w-4 h-4 mr-2" />
            Cloud-Native Architecture
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900">Microservice Architecture</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built with modern technologies for scalability, reliability, and performance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {architectureItems.map(({ icon: Icon, title, description, tech }) => (
            <Card key={title} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/60 backdrop-blur-sm hover-lift">
              <CardHeader className="pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                  <Icon className="w-10 h-10 text-gray-700" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 justify-center">
                  {tech.map((item) => (
                    <Badge key={item} variant="secondary" className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <Card className="bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600 text-white border-0 shadow-2xl mx-4">
        <CardContent className="py-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-cyan-100 font-medium">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold mb-2">&lt;100ms</div>
              <div className="text-cyan-100 font-medium">Response Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold mb-2">2x</div>
              <div className="text-cyan-100 font-medium">Auto Scaling</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-cyan-100 font-medium">Audit Trail</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <div className="text-center space-y-8 px-4">
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-gray-900">Built with Modern Technologies</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Leveraging cutting-edge tools and frameworks to deliver a robust, scalable solution
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            'Node.js', 'TypeScript', 'React', 'Docker', 'Kubernetes',
            'SQLite', 'Tailwind CSS', 'shadcn/ui', 'REST APIs'
          ].map((tech) => (
            <Badge key={tech} variant="outline" className="text-sm py-3 px-5 font-medium bg-white/60 backdrop-blur-sm border-gray-200 hover:bg-white/80 transition-all duration-300 hover-lift">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 pt-8">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Cloud Native</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Enterprise Security</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Real-time Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
}