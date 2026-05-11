import { motion } from 'framer-motion'
import { QrCode, Smartphone, UtensilsCrossed } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: QrCode,
    title: 'Setup in 5 minutes',
    description: 'Create your account, upload your menu, and print QR codes. No technical skills required.',
    details: ['Create account', 'Upload menu items', 'Print QR codes'],
  },
  {
    number: '02',
    icon: Smartphone,
    title: 'Customers scan & order',
    description: 'Guests scan the QR code with their phone camera, browse your beautiful menu, and place orders instantly.',
    details: ['Phone camera scan', 'Browse digital menu', 'Place order instantly'],
  },
  {
    number: '03',
    icon: UtensilsCrossed,
    title: 'You manage & serve',
    description: 'Orders appear in real-time on your dashboard. Kitchen prepares, servers deliver, customers happy.',
    details: ['Real-time notifications', 'Kitchen preparation', 'Fast service'],
  },
]

export default function HowItWorks() {
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
            HOW IT WORKS
          </div>
          <h2 className="mb-6">
            Simple setup,<br />powerful results
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes. No complex installation, no expensive hardware, no training needed.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Number Badge */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Detail List */}
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
