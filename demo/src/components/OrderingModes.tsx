import { motion } from 'framer-motion'
import { UtensilsCrossed, ShoppingBag, Truck, QrCode } from 'lucide-react'
import TiltCard from './TiltCard'

const orderingModes = [
  {
    icon: UtensilsCrossed,
    title: 'Dine-In',
    description: 'Customers scan QR codes at tables, browse menus, and order directly. No waiting for servers.',
    benefits: ['Table-specific orders', 'Faster turnover', 'Reduced labor costs'],
    color: 'from-blue-500/20 to-cyan-500/20',
    stat: '40% faster',
  },
  {
    icon: ShoppingBag,
    title: 'Takeout',
    description: 'Customers order ahead for pickup. Prepare orders just-in-time, reduce wait times.',
    benefits: ['Scheduled pickups', 'Order accuracy', 'Contactless experience'],
    color: 'from-purple-500/20 to-pink-500/20',
    stat: 'Zero errors',
  },
  {
    icon: Truck,
    title: 'Delivery',
    description: 'Integrated delivery management. Track drivers, manage zones, optimize routes.',
    benefits: ['Real-time tracking', 'Delivery zones', 'Driver management'],
    color: 'from-orange-500/20 to-red-500/20',
    stat: 'Live tracking',
  },
]

export default function OrderingModes() {
  return (
    <section id="ordering-modes" className="flowsuite-section bg-muted/20">
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
            ORDERING MODES
          </div>
          <h2 className="mb-6">
            One platform,<br />multiple ordering experiences
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether customers dine in, pick up, or want delivery—RestoQR handles it all seamlessly.
          </p>
        </motion.div>

        {/* Mode Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {orderingModes.map((mode, index) => (
            <TiltCard key={index} className="flowsuite-card p-8 group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col h-full"
              >
                {/* Icon & Stat */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <mode.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {mode.stat}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold mb-3">{mode.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                  {mode.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-2">
                  {mode.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </TiltCard>
          ))}
        </div>

        {/* Unified System Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="flowsuite-card p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-3">Unified Order Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All orders—dine-in, takeout, and delivery—appear in one dashboard. 
                  Manage everything from a single interface with real-time updates, 
                  automatic notifications, and intelligent prioritization.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold mb-3">Complete Restaurant Solution</h3>
            <p className="text-muted-foreground">Everything you need across all ordering channels</p>
          </div>

          <div className="flowsuite-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground">Feature</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-blue-500" />
                        Dine-In
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-purple-500" />
                        Takeout
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Truck className="w-4 h-4 text-orange-500" />
                        Delivery
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['QR Code Menus', true, true, false],
                    ['Real-time Orders', true, true, true],
                    ['Table Management', true, false, false],
                    ['Scheduled Pickup', false, true, false],
                    ['Delivery Zones', false, false, true],
                    ['Driver Tracking', false, false, true],
                    ['Order Analytics', true, true, true],
                    ['Staff Notifications', true, true, true],
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium">{row[0]}</td>
                      <td className="py-4 px-6 text-center">
                        {row[1] ? (
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row[2] ? (
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row[3] ? (
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
