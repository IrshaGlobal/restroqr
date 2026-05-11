import { motion } from 'framer-motion'

const integrations = [
  { name: 'FlowSync' },
  { name: 'PipeFlow' },
  { name: 'LinkHive' },
  { name: 'CoreSuite' },
  { name: 'WorkStream' },
  { name: 'DataFlow' },
]

export default function Integrations() {
  return (
    <section className="flowsuite-section bg-muted/30">
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
            INTEGRATION
          </div>
          <h2 className="mb-6">Integrate with the leading tools</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay ahead with tips, CRM best practices, and stories from fast-growing teams.
          </p>
        </motion.div>

        {/* Integration Logos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center items-center gap-6 max-w-4xl mx-auto"
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="flowsuite-card px-10 py-8 cursor-pointer"
            >
              <p className="text-base font-semibold text-center">{integration.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
