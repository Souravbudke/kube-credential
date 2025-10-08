import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/components/BentoCard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 min-h-screen flex flex-col justify-between bg-black">
        <div className="flex-1 flex items-start justify-center pt-8 sm:pt-12 md:pt-20">
          <div className="text-center animate-fade-in">
            <div className="relative">
              <h1 className="text-6xl sm:text-5xl md:text-7xl lg:text-9xl xl:text-[12rem] font-black mb-4 sm:mb-6 tracking-tight leading-none drop-shadow-2xl bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                KUBE
              </h1>
              <div className="absolute inset-0 text-6xl sm:text-5xl md:text-7xl lg:text-9xl xl:text-[12rem] font-black text-white/10 blur-sm -z-10">
                KUBE
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-200 mb-6 sm:mb-8 tracking-wide drop-shadow-lg">
              CREDENTIAL PLATFORM
            </h2>
            <div className="w-32 sm:w-48 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-60 rounded-full"></div>
          </div>
        </div>

        <div className="container mx-auto text-center pb-6 sm:pb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 text-balance px-4">
              The next-generation, cloud-native platform for issuing, verifying, and managing
              <span className="text-gray-300"> digital credentials </span>
              with enterprise-grade security and infinite scalability.
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
              <Button size="lg" asChild className="bg-white hover:bg-gray-200 text-black w-full sm:w-auto">
                <Link to="/issue">
                  Issue Credential
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent w-full sm:w-auto"
              >
                <Link to="/verify">Verify Credential</Link>
              </Button>
            </div>

            {/* Company Logos */}
            <div className="mt-8 sm:mt-12 md:mt-16 mb-6 sm:mb-8">
              <div className="group relative m-auto max-w-6xl text-center">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex-shrink-0">
                    <p className="text-sm sm:text-base text-gray-400 font-medium">Powering the best</p>
                  </div>
                  <div className="py-2 sm:py-4">
                    <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 flex-wrap">
                      <div className="text-gray-400 text-sm sm:text-base font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        Node.js
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        TypeScript
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        Docker
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        Kubernetes
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        React
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        SQLite
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        Azure
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 px-4 bg-black">

        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Everything you need to manage credentials at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-2">
              <BentoCard
                title="Issue Credentials"
                value=""
                subtitle="Create and issue new digital credentials with proper validation and worker tracking."
                features={[
                  "Structured data entry",
                  "Unique ID generation",
                  "Worker audit trails",
                  "Duplicate prevention"
                ]}
                colors={["#1a1a1a", "#2a2a2a", "#1f1f1f"]}
                delay={0.2}
              />
            </div>
            <BentoCard
              title="Verify Credentials"
              value="99.9%"
              subtitle="Validate authenticity and integrity with cross-service validation and real-time verification"
              colors={["#151515", "#252525", "#1d1d1d"]}
              delay={0.4}
            />
            <BentoCard
              title="Service Health"
              value="<100ms"
              subtitle="Monitor health and performance of all microservices with real-time insights"
              colors={["#1c1c1c", "#2c2c2c", "#181818"]}
              delay={0.6}
            />
            <div className="md:col-span-2">
              <BentoCard
                title="Verify Credentials"
                value=""
                subtitle="Validate the authenticity and integrity of issued credentials."
                features={[
                  "Cross-service validation",
                  "Data integrity checks",
                  "Verification history",
                  "Real-time verification"
                ]}
                colors={["#171717", "#272727", "#1b1b1b"]}
                delay={0.8}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
