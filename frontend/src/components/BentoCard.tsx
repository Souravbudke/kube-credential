import { motion } from "framer-motion"

interface BentoCardProps {
  title: string
  value: string | number
  subtitle?: string
  features?: string[]
  colors: string[]
  delay: number
}

const BentoCard: React.FC<BentoCardProps> = ({ title, value, subtitle, features, colors, delay }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay + 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="relative overflow-hidden h-full bg-black rounded-lg border border-gray-800 group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      style={{
        filter: "url(#noise)",
      }}
    >
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 opacity-80 transition-opacity duration-500"
        style={{
          background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        }}
      />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full animate-pulse"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "48px 48px, 64px 64px",
            backgroundPosition: "0 0, 24px 24px",
          }}
        />
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-80 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full animate-[shine_4s_ease-in-out_infinite] w-[200%]" />
      </div>

      <motion.div
        className="relative z-10 p-3 sm:p-5 md:p-8 text-white backdrop-blur-sm h-full flex flex-col justify-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h3 className="text-sm sm:text-base md:text-lg text-white mb-2" variants={item}>
          {title}
        </motion.h3>
        <motion.p className="text-2xl sm:text-4xl md:text-5xl font-medium mb-4 text-white" variants={item}>
          {value}
        </motion.p>
        {subtitle && (
          <motion.p className="text-sm text-gray-400 mb-4" variants={item}>
            {subtitle}
          </motion.p>
        )}
        {features && (
          <motion.div className="space-y-2" variants={item}>
            {features.map((feature, index) => (
              <div key={index} className="flex items-start text-sm text-gray-400">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-3 mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{feature}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export { BentoCard }
