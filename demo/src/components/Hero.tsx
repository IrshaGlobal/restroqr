import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import MagneticButton from './MagneticButton'
import RestaurantVisual from './RestaurantVisual'
import ScrollIndicator from './ScrollIndicator'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Atmospheric Glow Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="flowsuite-container relative z-10">
        {/* Asymmetric Layout - 60/40 split */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content (60%) */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center mb-8"
            >
              <span className="flowsuite-badge">
                Trusted by 500+ Restaurants
              </span>
            </motion.div>

            {/* Main Headline - Restaurant-focused */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="mb-6"
            >
              Digital menus that
              <br />
              <span className="flowsuite-gradient-text">drive revenue.</span>
            </motion.h1>

            {/* Subheading - Outcome-focused for restaurants */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
            >
              Replace paper menus with beautiful digital experiences. Accept orders instantly, manage tables effortlessly, and boost revenue by 40%.
            </motion.p>

            {/* CTA Buttons - Magnetic effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <MagneticButton className="flowsuite-button-primary">
                Start free trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </MagneticButton>
              <button className="flowsuite-button-secondary">
                Watch demo
              </button>
            </motion.div>

            {/* Trust indicators - Restaurant-specific */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>No hardware needed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Visual (40%) */}
          <div className="lg:col-span-5 hidden lg:block">
            <RestaurantVisual />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  )
}
