import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Owner',
    restaurant: 'Bamboo Garden',
    quote: 'Revenue increased 35% in first month. Customers love the convenience of ordering directly from their phones!',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Manager',
    restaurant: 'Taco Libre',
    quote: 'Setup took 10 minutes. Our servers can focus on service, not order-taking. Game changer for our busy nights.',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'Owner',
    restaurant: 'The Coffee Spot',
    quote: 'Best investment we\'ve made. Reduced order errors by 90% and customers appreciate the modern experience.',
    rating: 5,
  },
]

export default function Testimonials() {
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
            TESTIMONIALS
          </div>
          <h2 className="mb-6">
            Loved by restaurant<br />owners worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what real restaurant owners are saying about RestoQR.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flowsuite-card p-8"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg leading-relaxed mb-8">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-cyan-500/30 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.restaurant}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
