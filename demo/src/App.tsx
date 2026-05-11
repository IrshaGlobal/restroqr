import { motion } from 'framer-motion'
import Hero from './components/Hero'
import SocialProof from './components/SocialProof'
import Features from './components/Features'
import OrderingModes from './components/OrderingModes'
import HowItWorks from './components/HowItWorks'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import DriftingOrbs from './components/DriftingOrbs'
import NoiseTexture from './components/NoiseTexture'
import MouseSpotlight from './components/MouseSpotlight'
import CursorGlow from './components/CursorGlow'

function App() {
  return (
    <div className="min-h-screen relative">
      {/* Atmospheric Background Effects */}
      <NoiseTexture />
      <DriftingOrbs count={5} />
      <MouseSpotlight />
      <CursorGlow />
      
      {/* Navigation - Clean & Minimal with translucent background */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/30"
      >
        <div className="flowsuite-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-white"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className="text-xl font-bold">RestoQR</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#ordering-modes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Ordering Modes
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </a>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                Sign In
              </button>
              <button className="flowsuite-button-primary px-6 py-2.5 text-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <OrderingModes />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
