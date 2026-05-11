import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Shield, Users, Zap, Building, TrendingUp, Clock, Award } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

const pricingPlans = {
  monthly: [
    {
      name: 'Starter',
      price: '29',
      description: 'Perfect for small cafes, food trucks, and pop-ups.',
      features: [
        'Up to 50 tables',
        'Basic menu customization',
        'Real-time orders',
        'Email support',
        'QR code generation',
        'Basic analytics',
      ],
      featured: false,
      perfectFor: 'Small cafes, food trucks',
    },
    {
      name: 'Professional',
      price: '79',
      description: 'Ideal for full-service restaurants and chains.',
      features: [
        'Unlimited tables',
        'Advanced customization',
        'Analytics dashboard',
        'Priority support',
        'Staff accounts (up to 10)',
        'API access',
        'Multi-location support',
        'Custom integrations',
      ],
      featured: true,
      perfectFor: 'Full-service restaurants',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large restaurant groups and franchises.',
      features: [
        'White-label branding',
        'Dedicated account manager',
        'Custom integrations',
        '24/7 premium support',
        'Advanced security',
        'API SLA guarantee',
        'On-premise hosting',
        'Custom feature development',
      ],
      featured: false,
      perfectFor: 'Restaurant chains',
    },
  ],
  yearly: [
    {
      name: 'Starter',
      price: '24',
      description: 'Perfect for small cafes, food trucks, and pop-ups.',
      features: [
        'Up to 50 tables',
        'Basic menu customization',
        'Real-time orders',
        'Email support',
        'QR code generation',
        'Basic analytics',
      ],
      featured: false,
      perfectFor: 'Small cafes, food trucks',
    },
    {
      name: 'Professional',
      price: '64',
      description: 'Ideal for full-service restaurants and chains.',
      features: [
        'Unlimited tables',
        'Advanced customization',
        'Analytics dashboard',
        'Priority support',
        'Staff accounts (up to 10)',
        'API access',
        'Multi-location support',
        'Custom integrations',
      ],
      featured: true,
      perfectFor: 'Full-service restaurants',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large restaurant groups and franchises.',
      features: [
        'White-label branding',
        'Dedicated account manager',
        'Custom integrations',
        '24/7 premium support',
        'Advanced security',
        'API SLA guarantee',
        'On-premise hosting',
        'Custom feature development',
      ],
      featured: false,
      perfectFor: 'Restaurant chains',
    },
  ],
}

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-foreground text-xs font-semibold uppercase tracking-wider mb-6">
            PRICING PLANS
          </div>
          <h2 className="mb-6">Simple, transparent pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your restaurant. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Billing Toggle with Layout Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-16"
        >
          <div className="relative inline-flex items-center p-1 rounded-full bg-muted/30 border border-border/50 backdrop-blur-sm">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-y-1 rounded-full bg-primary"
              style={{
                left: billingCycle === 'monthly' ? '4px' : '50%',
                width: 'calc(50% - 4px)',
              }}
            />
            <button
              onClick={() => setBillingCycle('monthly')}
              className="relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors"
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className="relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
            >
              Yearly
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans[billingCycle].map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flowsuite-card p-8 relative ${
                plan.featured ? 'border-primary border-2 scale-105' : ''
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-white text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-4">
                  {plan.price !== 'Custom' && <span className="text-5xl font-bold">$</span>}
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-muted-foreground text-lg">/month</span>}
                </div>

                {plan.perfectFor && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 text-xs font-medium">
                    <Star className="w-3 h-3 text-primary" />
                    Perfect for: {plan.perfectFor}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full ${plan.featured ? 'flowsuite-button-primary' : 'flowsuite-button-secondary'}`}>
                {plan.price === 'Custom' ? 'Contact Sales' : 'Start free trial'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Value Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
        >
          {[
            {
              icon: <TrendingUp className="w-6 h-6" />,
              metric: '40%',
              label: 'Average revenue increase',
              description: 'Restaurants see significant growth within 3 months',
            },
            {
              icon: <Clock className="w-6 h-6" />,
              metric: '15min',
              label: 'Setup time',
              description: 'From signup to first order in minutes',
            },
            {
              icon: <Award className="w-6 h-6" />,
              metric: '98%',
              label: 'Customer satisfaction',
              description: 'Based on 2M+ orders processed',
            },
          ].map((item, idx) => (
            <div key={idx} className="flowsuite-card p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                {item.icon}
              </div>
              <div className="text-3xl font-bold mb-2 gradient-text">
                {item.metric}
              </div>
              <div className="font-semibold mb-1">{item.label}</div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Social Proof Below Pricing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-2">
            Join <span className="text-foreground font-semibold"><AnimatedCounter value={500} suffix="+" /> restaurants</span> already using RestoQR
          </p>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">4.9/5 from <AnimatedCounter value={200} suffix="+" /> reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
