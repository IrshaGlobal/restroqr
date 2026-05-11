import { motion } from 'framer-motion'
import { Eye, TrendingUp, Zap, Globe, Workflow, LayoutDashboard } from 'lucide-react'

const benefits = [
  {
    icon: Eye,
    title: 'Clear visibility into interaction',
    description: 'Flowsuite centralizes all your contacts, communication history, notes, activities, and tasks.',
  },
  {
    icon: TrendingUp,
    title: 'Smoother sales pipelines',
    description: 'Track leads, automate follow-ups, and move deals forward with organized sales flow.',
  },
  {
    icon: Zap,
    title: 'Increased team productivity',
    description: 'Automate repetitive tasks like reminders, follow-ups, email sends, task assignments.',
  },
  {
    icon: Globe,
    title: 'Flexible & Remote-Friendly',
    description: 'Work from anywhere with ease. Stay connected and productive no matter where you are.',
  },
  {
    icon: Workflow,
    title: 'Smart Workflow Automation',
    description: 'Work your way with tools that keep you connected and productive.',
  },
  {
    icon: LayoutDashboard,
    title: 'Customizable Dashboard',
    description: 'Build your ideal workspace with widgets and layouts that match your workflow.',
  },
]

export default function Benefits() {
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-foreground text-sm font-medium mb-6">
            BENEFITS
          </div>
          <h2 className="mb-6">
            The Powerful Advantages<br />Your Team Gets
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock key benefits that boost your team's productivity and performance.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flowsuite-card p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
