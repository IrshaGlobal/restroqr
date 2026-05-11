import { motion } from 'framer-motion'
import { QrCode, Bell, Users, BarChart3 } from 'lucide-react'
import TiltCard from './TiltCard'

const features = [
  {
    icon: QrCode,
    title: 'Instant Digital Menus',
    description: 'Generate beautiful QR codes in seconds. Customers scan, browse, and order directly from their phones.',
    stat: 'Zero hardware',
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Bell,
    title: 'Live Order Dashboard',
    description: 'See orders appear instantly. Manage preparation, track status, and notify customers automatically.',
    stat: '< 2s latency',
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    icon: Users,
    title: 'Team Coordination',
    description: 'Role-based dashboards for servers, kitchen staff, and managers. Everyone stays synchronized.',
    stat: 'Multi-role',
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: BarChart3,
    title: 'Revenue Intelligence',
    description: 'Track popular items, peak hours, and customer preferences. Make data-driven decisions.',
    stat: 'Real-time',
    color: 'from-orange-500/20 to-red-500/20',
  },
]

export default function Features() {
  const featuredFeature = features[0]
  const otherFeatures = features.slice(1)

  return (
    <section className="flowsuite-section">
      <div className="flowsuite-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-foreground text-xs font-semibold uppercase tracking-wider mb-6">
            FEATURES
          </div>
          <h2 className="mb-6">
            Everything you need to
            <br />run a modern restaurant
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed specifically for restaurants. From digital menus to real-time analytics.
          </p>
        </motion.div>

        {/* Bento Grid Layout - Asymmetric */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Large Feature Card - Spans 2 columns */}
          <TiltCard className="md:col-span-2 lg:col-span-2 flowsuite-card p-8 md:p-10 group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row gap-6 items-start"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${featuredFeature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <featuredFeature.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-2xl md:text-3xl font-semibold">{featuredFeature.title}</h3>
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {featuredFeature.stat}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {featuredFeature.description}
                </p>
                {/* Mini visualization */}
                <div className="flex gap-2">
                  {[60, 75, 45, 90, 65].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 h-16 rounded-lg bg-gradient-to-t from-primary/30 to-primary/10"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </TiltCard>

          {/* Regular Feature Cards */}
          {otherFeatures.map((feature, index) => (
            <TiltCard key={index} className="flowsuite-card p-8 group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                className="flex flex-col h-full"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {feature.stat}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {feature.description}
                </p>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
