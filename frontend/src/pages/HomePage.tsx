import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ParticleTextEffect } from '@/components/ParticleTextEffect';
import { BentoCard } from '@/components/BentoCard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden min-h-screen flex flex-col justify-between bg-black">
        <div className="flex-1 flex items-start justify-center pt-20">
          <ParticleTextEffect words={["KUBE", "CREDENTIAL", "PLATFORM", "KUBE"]} />
        </div>

        <div className="container mx-auto text-center relative z-10 pb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-balance">
              The next-generation, cloud-native platform for issuing, verifying, and managing
              <span className="text-gray-300"> digital credentials </span>
              with enterprise-grade security and infinite scalability.
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild className="bg-white hover:bg-gray-200 text-black">
                <Link to="/issue">
                  Issue Credential
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-gray-600 text-white hover:bg-gray-800 bg-transparent"
              >
                <Link to="/verify">Verify Credential</Link>
              </Button>
            </div>

            {/* Company Logos */}
            <div className="mt-16 mb-8">
              <div className="group relative m-auto max-w-6xl">
                <div className="flex flex-col items-center md:flex-row">
                  <div className="md:max-w-44 md:border-r md:border-gray-600 md:pr-6 mb-4 md:mb-0">
                    <p className="text-end text-sm text-gray-400">Powering the best </p>
                  </div>
                  <div className="relative py-6 md:w-[calc(100%-11rem)]">
                    <div className="flex items-center justify-center gap-12 md:gap-16 flex-wrap">
                      <div className="text-gray-400 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        Node.js
                      </div>
                      <div className="text-gray-400 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        TypeScript
                      </div>
                      <div className="text-gray-400 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        Docker
                      </div>
                      <div className="text-gray-400 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        Kubernetes
                      </div>
                      <div className="text-gray-400 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        React
                      </div>
                      <div className="text-gray-400 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">
                        SQLite
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
      <section id="features" className="py-20 px-4 bg-black">
        <svg width="0" height="0" className="absolute">
          <defs>
            <filter id="noise" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence baseFrequency="0.4" numOctaves="2" result="noise" seed="2" type="fractalNoise" />
              <feColorMatrix in="noise" type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="discrete" tableValues="0.02 0.04 0.06" />
              </feComponentTransfer>
              <feComposite operator="over" in2="SourceGraphic" />
            </filter>
          </defs>
        </svg>

        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage credentials at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
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
