import { motion } from 'framer-motion'
import { TrendingUp, UtensilsCrossed, Star, Zap } from 'lucide-react'

const stats = [
  {
    icon: UtensilsCrossed,
    value: '500+',
    label: 'Restaurants',
    color: 'text-primary',
  },
  {
    icon: TrendingUp,
    value: '40%',
    label: 'Avg Revenue Increase',
    color: 'text-green-500',
  },
  {
    icon: Zap,
    value: '2M+',
    label: 'Orders Processed',
    color: 'text-cyan-500',
  },
  {
    icon: Star,
    value: '4.9/5',
    label: 'Customer Rating',
    color: 'text-yellow-500',
  },
]

export default function SocialProof() {
  return (
    <section className="py-20 border-y border-border/40">
      <div className="flowsuite-container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Trusted by <span className="text-foreground font-semibold">500+ restaurants</span> worldwide
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted/30 mb-3 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`text-3xl md:text-4xl font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
