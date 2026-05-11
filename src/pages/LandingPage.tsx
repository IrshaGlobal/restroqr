import { Link } from 'react-router-dom'
import { 
  QrCode, 
  UtensilsCrossed, 
  Zap, 
  LayoutDashboard, 
  Bell, 
  Smartphone,
  Check,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Shield,
  Clock,
  BarChart3,
  Globe,
  Sparkles,
  ChefHat,
  TabletSmartphone,
  X,
  ShoppingBag,
  Truck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-subtle relative">
      {/* Atmospheric Background Effects */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Navigation - Floating Capsule Design */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-md">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight gradient-text-premium">RestoQR</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
            </a>
            <a href="#ordering-modes" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group">
              Ordering Modes
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group">
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
            </a>
            <a href="#pricing" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
            </a>
            <a href="#testimonials" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative group">
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-200 group-hover:w-full" />
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/admin">
              <Button size="sm" className="btn-premium">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Cinematic Asymmetric Layout */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Ambient gradient overlay */}
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        
        <div className="container mx-auto px-6 relative">
          {/* Asymmetric two-column layout */}
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-20">
            
            {/* Left: Typographic hero (7 cols) */}
            <div className="lg:col-span-7 animate-fade-in-up">
              <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                Trusted by 2,000+ restaurants
              </Badge>
              
              <h1 className="text-display-lg font-bold mb-6 text-foreground">
                Transform dining with{' '}
                <span className="gradient-text-premium">intelligent ordering</span>
              </h1>
              
              <p className="text-body-lg text-foreground/70 mb-8 max-w-xl leading-relaxed">
                From table scan to kitchen delivery—seamless QR-based operations 
                that boost revenue by 47% and reduce wait times by 32%.
              </p>
              
              {/* Dual CTA with clear hierarchy */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/menu?table=1&restaurant=demo">
                  <Button size="xl" className="btn-premium w-full sm:w-auto group">
                    Try Live Demo
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-8 flex items-center gap-6 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>14-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            
            {/* Right: Interactive product preview (5 cols) */}
            <div className="lg:col-span-5 animate-scale-in" style={{ animationDelay: '200ms' }}>
              <Card className="glass-premium p-6 shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
                    <div>
                      <p className="text-sm font-semibold">Table 5</p>
                      <p className="text-xs text-foreground/60">2x Margherita, 1x Pasta</p>
                    </div>
                    <Badge variant="success" className="text-xs">New</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
                    <div>
                      <p className="text-sm font-semibold">Table 12</p>
                      <p className="text-xs text-foreground/60">1x Burger, 2x Fries</p>
                    </div>
                    <Badge variant="warning" className="text-xs">Preparing</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30">
                    <div>
                      <p className="text-sm font-semibold">Table 8</p>
                      <p className="text-xs text-foreground/60">3x Coffee, 2x Cake</p>
                    </div>
                    <Badge variant="info" className="text-xs">Ready</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Asymmetric Bento Grid - Feature Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto">
            
            {/* Large feature card (8 cols) */}
            <Card className="md:col-span-8 glass-premium p-8 hover-lift group animate-fade-in-up"
                  style={{ animationDelay: '400ms' }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge variant="default" className="mb-3">Most Popular</Badge>
                  <h3 className="text-2xl font-bold mb-2">Real-Time Order Management</h3>
                  <p className="text-foreground/70">Live tracking from customer to kitchen with instant notifications</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
              </div>
              <div className="bg-background/50 border border-border/30 rounded-lg p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Table 5 - New Order</span>
                  <Badge variant="success" className="text-xs">Just now</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Table 12 - Preparing</span>
                  <Badge variant="warning" className="text-xs">5 min ago</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Table 8 - Ready</span>
                  <Badge variant="info" className="text-xs">12 min ago</Badge>
                </div>
              </div>
            </Card>
            
            {/* Stats card (4 cols) */}
            <Card className="md:col-span-4 glass-premium p-8 hover-lift animate-fade-in-up"
                  style={{ animationDelay: '500ms' }}>
              <TrendingUp className="w-8 h-8 text-success mb-4" />
              <h3 className="text-4xl font-bold mb-2">+47%</h3>
              <p className="text-foreground/70 mb-4">Revenue increase</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Turnover</span>
                  <span className="font-semibold">+32%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Accuracy</span>
                  <span className="font-semibold">99.8%</span>
                </div>
              </div>
            </Card>
            
            {/* Mobile card (4 cols) */}
            <Card className="md:col-span-4 glass-premium p-8 hover-lift animate-fade-in-up"
                  style={{ animationDelay: '600ms' }}>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mobile-First Design</h3>
              <p className="text-foreground/70 mb-4">Beautiful, responsive interface optimized for all devices</p>
              <div className="flex gap-2">
                <Badge variant="secondary">iOS</Badge>
                <Badge variant="secondary">Android</Badge>
                <Badge variant="secondary">Web</Badge>
              </div>
            </Card>
            
            {/* Analytics card (8 cols) */}
            <Card className="md:col-span-8 glass-premium p-8 hover-lift animate-fade-in-up"
                  style={{ animationDelay: '700ms' }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Powerful Analytics Dashboard</h3>
                  <p className="text-foreground/70">Track performance, optimize menu, and make data-driven decisions</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center text-info group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background/50 border border-border/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary">284</p>
                  <p className="text-xs text-foreground/60 mt-1">Orders Today</p>
                </div>
                <div className="bg-background/50 border border-border/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-success">$4.2k</p>
                  <p className="text-xs text-foreground/60 mt-1">Revenue</p>
                </div>
                <div className="bg-background/50 border border-border/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-accent">4.8★</p>
                  <p className="text-xs text-foreground/60 mt-1">Rating</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Sophisticated Asymmetric Grid */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-feature pointer-events-none" />
        
        <div className="container mx-auto px-6 relative">
          {/* Section header with editorial treatment */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
              Platform Capabilities
            </Badge>
            <h2 className="text-display-lg font-bold mb-4">
              Everything needed to{' '}
              <span className="gradient-text">excel</span>
            </h2>
            <p className="text-body-lg text-foreground/70">
              A complete suite engineered for modern restaurant operations
            </p>
          </div>
          
          {/* Asymmetric feature grid */}
          <div className="grid md:grid-cols-12 gap-6 max-w-6xl mx-auto">
            
            {/* Primary feature (spans 7 cols) */}
            <FeatureCardLarge
              icon={<QrCode className="w-7 h-7" />}
              title="Instant QR Ordering"
              description="Customers scan table codes to access menus and place orders instantly. No app download required—works on any smartphone."
              badge="Core Platform"
              className="md:col-span-7"
            />
            
            {/* Secondary feature (spans 5 cols) */}
            <FeatureCardMedium
              icon={<Zap className="w-6 h-6" />}
              title="Real-Time Updates"
              description="Live order tracking with instant status notifications from kitchen to table."
              badge="Most Popular"
              className="md:col-span-5"
            />
            
            {/* Tertiary features (4 cols each) */}
            <FeatureCardSmall
              icon={<Bell className="w-5 h-5" />}
              title="Smart Notifications"
              description="Sound alerts and visual indicators for new orders and help requests."
              className="md:col-span-4"
            />
            
            <FeatureCardSmall
              icon={<ChefHat className="w-5 h-5" />}
              title="Kitchen Display"
              description="Optimized dashboard with order queue management and timers."
              className="md:col-span-4"
            />
            
            <FeatureCardSmall
              icon={<Shield className="w-5 h-5" />}
              title="Enterprise Security"
              description="Bank-level encryption with role-based access control."
              badge="Pro"
              className="md:col-span-4"
            />
            
            {/* Additional features in 3-col grid below */}
            <div className="md:col-span-12 grid md:grid-cols-3 gap-6 mt-6">
              <FeatureCardSmall
                icon={<UtensilsCrossed className="w-5 h-5" />}
                title="Menu Management"
                description="Easy admin panel to manage items, categories, prices, and availability."
              />
              <FeatureCardSmall
                icon={<Users className="w-5 h-5" />}
                title="Staff Management"
                description="Role-based access control with staff accounts and permissions."
              />
              <FeatureCardSmall
                icon={<TabletSmartphone className="w-5 h-5" />}
                title="Multi-Device Support"
                description="Works seamlessly on smartphones, tablets, and desktops."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ordering Modes Section - Multi-Channel Capabilities */}
      <section id="ordering-modes" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-subtle pointer-events-none" />
        
        <div className="container mx-auto px-6 relative">
          {/* Section Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
              Ordering Modes
            </Badge>
            <h2 className="text-display-lg font-bold mb-4">
              One platform,{' '}
              <span className="gradient-text">multiple experiences</span>
            </h2>
            <p className="text-body-lg text-foreground/70">
              Whether customers dine in, pick up, or want delivery—RestoQR handles it all seamlessly.
            </p>
          </div>

          {/* Three Mode Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            <OrderingModeCard
              icon={<UtensilsCrossed className="w-7 h-7" />}
              title="Dine-In"
              description="Customers scan QR codes at tables, browse menus, and order directly. No waiting for servers."
              benefits={['Table-specific orders', 'Faster turnover', 'Reduced labor costs']}
              stat="40% faster"
              color="primary"
            />
            
            <OrderingModeCard
              icon={<ShoppingBag className="w-7 h-7" />}
              title="Takeout"
              description="Customers order ahead for pickup. Prepare orders just-in-time, reduce wait times."
              benefits={['Scheduled pickups', 'Order accuracy', 'Contactless experience']}
              stat="Zero errors"
              color="accent"
            />
            
            <OrderingModeCard
              icon={<Truck className="w-7 h-7" />}
              title="Delivery"
              description="Integrated delivery management. Track drivers, manage zones, optimize routes."
              benefits={['Real-time tracking', 'Delivery zones', 'Driver management']}
              stat="Live tracking"
              color="success"
            />
          </div>

          {/* Unified Dashboard Highlight */}
          <Card className="glass-premium p-8 max-w-4xl mx-auto mb-16 hover-lift">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <LayoutDashboard className="w-10 h-10" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3">Unified Order Management</h3>
                <p className="text-foreground/70 leading-relaxed">
                  All orders—dine-in, takeout, and delivery—appear in one dashboard. 
                  Manage everything from a single interface with real-time updates, 
                  automatic notifications, and intelligent prioritization.
                </p>
              </div>
            </div>
          </Card>

          {/* Feature Comparison Table */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold mb-3">Complete Restaurant Solution</h3>
              <p className="text-foreground/70">Everything you need across all ordering channels</p>
            </div>

            <Card className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-foreground/60">Feature</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <UtensilsCrossed className="w-4 h-4 text-primary" />
                          Dine-In
                        </div>
                      </th>
                      <th className="text-center py-4 px-6 text-sm font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-accent" />
                          Takeout
                        </div>
                      </th>
                      <th className="text-center py-4 px-6 text-sm font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <Truck className="w-4 h-4 text-success" />
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
                      <tr key={idx} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6 text-sm font-medium">{row[0]}</td>
                        <td className="py-4 px-6 text-center">
                          {row[1] ? (
                            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                              <Check className="w-4 h-4 text-success" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                              <X className="w-4 h-4 text-muted-foreground/40" />
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {row[2] ? (
                            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                              <Check className="w-4 h-4 text-success" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                              <X className="w-4 h-4 text-muted-foreground/40" />
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {row[3] ? (
                            <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                              <Check className="w-4 h-4 text-success" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                              <X className="w-4 h-4 text-muted-foreground/40" />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Connected Timeline */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Simple Process</Badge>
            <h2 className="text-display-lg font-bold mb-4">Three steps to transformation</h2>
            <p className="text-body-lg text-foreground/70 max-w-2xl mx-auto">
              From setup to first order in under 10 minutes
            </p>
          </div>
          
          {/* Horizontal timeline with connecting line */}
          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <StepCardConnected
                step="01"
                icon={<QrCode className="w-8 h-8" />}
                title="Customer Scans QR"
                description="Diners scan the unique code at their table using any smartphone camera"
                color="primary"
                className="animate-fade-in-up"
                style={{ animationDelay: '100ms' }}
              />
              
              <StepCardConnected
                step="02"
                icon={<UtensilsCrossed className="w-8 h-8" />}
                title="Browse & Order"
                description="View digital menu, customize items, and submit order instantly"
                color="accent"
                className="animate-fade-in-up"
                style={{ animationDelay: '200ms' }}
              />
              
              <StepCardConnected
                step="03"
                icon={<Clock className="w-8 h-8" />}
                title="Track & Enjoy"
                description="Watch order progress from preparation to table delivery in real-time"
                color="success"
                className="animate-fade-in-up"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Intelligent Comparison */}
      <section id="pricing" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-display-lg font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-body-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Choose the perfect plan. No hidden fees, cancel anytime.
            </p>
            
            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-lg">
              <button className="px-4 py-2 rounded-md bg-card shadow-sm text-sm font-medium">
                Monthly
              </button>
              <button className="px-4 py-2 rounded-md text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">
                Annual <Badge variant="success" className="ml-1 text-[10px]">Save 20%</Badge>
              </button>
            </div>
          </div>
          
          {/* Value Visualization Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
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
                icon: <Star className="w-6 h-6" />,
                metric: '98%',
                label: 'Customer satisfaction',
                description: 'Based on 2M+ orders processed',
              },
            ].map((item, idx) => (
              <Card key={idx} className="glass-premium p-6 text-center hover-lift">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                  {item.icon}
                </div>
                <div className="text-3xl font-bold mb-2 gradient-text">
                  {item.metric}
                </div>
                <div className="font-semibold mb-1">{item.label}</div>
                <p className="text-sm text-foreground/60">{item.description}</p>
              </Card>
            ))}
          </div>
          
          {/* Asymmetric pricing grid */}
          <div className="grid md:grid-cols-12 gap-6 max-w-6xl mx-auto items-start">
            
            {/* Starter (3 cols) */}
            <PricingCard
              name="Starter"
              price="$29"
              description="Perfect for small cafes"
              features={[
                { text: "Up to 20 tables", included: true },
                { text: "Basic QR ordering", included: true },
                { text: "Email support", included: true },
                { text: "Standard analytics", included: true },
                { text: "Mobile app access", included: true },
                { text: "Kitchen display", included: false },
                { text: "Staff management", included: false },
              ]}
              ctaText="Get Started"
              variant="outline"
              className="md:col-span-3"
            />
            
            {/* Professional (6 cols) - Featured */}
            <PricingCardFeatured
              name="Professional"
              price="$79"
              description="Ideal for growing restaurants"
              features={[
                { text: "Unlimited tables", included: true, highlighted: true },
                { text: "Advanced QR features", included: true, highlighted: true },
                { text: "Priority 24/7 support", included: true, highlighted: true },
                { text: "Full analytics suite", included: true, highlighted: true },
                { text: "Kitchen display system", included: true, highlighted: true },
                { text: "Staff management", included: true, highlighted: true },
                { text: "Custom branding", included: true },
                { text: "API access", included: false },
              ]}
              ctaText="Start Free Trial"
              badge="Most Popular"
              className="md:col-span-6"
            />
            
            {/* Enterprise (3 cols) */}
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="For restaurant chains"
              features={[
                { text: "Everything in Pro", included: true },
                { text: "Multi-location support", included: true },
                { text: "Dedicated account manager", included: true },
                { text: "Custom integrations", included: true },
                { text: "White-label solution", included: true },
                { text: "SLA guarantee", included: true },
                { text: "API access", included: true },
              ]}
              ctaText="Contact Sales"
              variant="outline"
              className="md:col-span-3"
            />
          </div>
          
          {/* Trust signals */}
          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-6 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Editorial Quote Layout */}
      <section id="testimonials" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-display-lg font-bold mb-4">Loved by restaurants worldwide</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialEditorial
              quote="RestoQR transformed our operations. We've seen a 40% increase in table turnover and customers love the convenience."
              author="Sarah Chen"
              role="Owner"
              company="Golden Dragon Bistro"
              metric="+40% turnover"
            />
            
            <TestimonialEditorial
              quote="The real-time order tracking is incredible. Our kitchen staff can now prioritize orders efficiently without any confusion."
              author="Michael Rodriguez"
              role="Manager"
              company="Bella Italia"
              metric="99.8% accuracy"
            />
            
            <TestimonialEditorial
              quote="Setup was incredibly easy. Within 2 hours we were fully operational. The support team is outstanding!"
              author="Emma Thompson"
              role="Founder"
              company="Cafe Noir"
              metric="2hr setup"
            />
          </div>
        </div>
      </section>

      {/* CTA Section - High-Conversion Final Push */}
      <section className="py-24 relative overflow-hidden">
        {/* Dramatic gradient background */}
        <div className="absolute inset-0 bg-gradient-cta opacity-5" />
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Globe className="w-4 h-4 mr-2 inline" />
              Join 2,000+ restaurants
            </Badge>
            
            <h2 className="text-display-lg font-bold mb-6">
              Ready to transform your restaurant?
            </h2>
            
            <p className="text-body-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Start your 14-day free trial today. No credit card required. 
              Cancel anytime.
            </p>
            
            {/* Urgency indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-lg mb-8">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-success">
                Average setup time: 8 minutes
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/admin">
                <Button size="xl" className="btn-premium w-full sm:w-auto group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/menu?table=1&restaurant=demo">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  View Live Demo
                </Button>
              </Link>
            </div>
            
            {/* Social proof */}
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-foreground/60">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                    <span className="text-xs font-medium">{String.fromCharCode(64+i)}</span>
                  </div>
                ))}
              </div>
              <span>Trusted by industry leaders</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimalist Design */}
      <footer className="border-t border-border/50 py-12 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-8 mb-12">
            {/* Brand column (4 cols) */}
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">RestoQR</span>
              </div>
              <p className="text-sm text-foreground/70 mb-4 max-w-xs">
                Modern QR-based ordering system for restaurants worldwide.
              </p>
            </div>
            
            {/* Links (8 cols distributed) */}
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              <FooterColumn title="Product" links={[
                { label: "Features", href: "#features" },
                { label: "Ordering Modes", href: "#ordering-modes" },
                { label: "Pricing", href: "#pricing" },
                { label: "Demo", href: "/menu?table=1&restaurant=demo" },
              ]} />
              
              <FooterColumn title="Company" links={[
                { label: "About", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Careers", href: "#" },
              ]} />
              
              <FooterColumn title="Support" links={[
                { label: "Help Center", href: "#" },
                { label: "Documentation", href: "#" },
                { label: "Status", href: "#" },
              ]} />
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/60">
              © 2026 RestoQR. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-foreground/60">
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Component Definitions

function FeatureCardLarge({ 
  icon, 
  title, 
  description, 
  badge,
  className 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  className?: string
}) {
  return (
    <Card className={`glass-premium p-8 hover-lift group ${className}`}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          {badge && (
            <Badge variant="default" className="mb-2 text-xs">{badge}</Badge>
          )}
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-foreground/70 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  )
}

function FeatureCardMedium({ 
  icon, 
  title, 
  description, 
  badge,
  className 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  className?: string
}) {
  return (
    <Card className={`glass-premium p-6 hover-lift group ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          {badge && (
            <Badge variant="default" className="mb-2 text-xs">{badge}</Badge>
          )}
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-foreground/70 text-sm">{description}</p>
        </div>
      </div>
    </Card>
  )
}

function FeatureCardSmall({ 
  icon, 
  title, 
  description, 
  badge,
  className 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  className?: string
}) {
  return (
    <Card className={`glass-card p-6 hover-lift group ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      {badge && (
        <Badge variant="secondary" className="mb-2 text-xs">{badge}</Badge>
      )}
      <h3 className="text-base font-semibold mb-2">{title}</h3>
      <p className="text-sm text-foreground/70">{description}</p>
    </Card>
  )
}

function StepCardConnected({ 
  step, 
  icon, 
  title, 
  description, 
  color,
  className,
  style
}: { 
  step: string
  icon: React.ReactNode
  title: string
  description: string
  color: 'primary' | 'accent' | 'success'
  className?: string
  style?: React.CSSProperties
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-success/10 text-success border-success/20'
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Step number badge */}
      <div className={`w-16 h-16 rounded-2xl ${colorClasses[color]} border flex items-center justify-center mx-auto mb-6 relative z-10 bg-card`}>
        {icon}
      </div>
      
      {/* Step label */}
      <div className="text-xs font-bold text-foreground/50 uppercase tracking-widest mb-2 text-center">
        Step {step}
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-bold mb-3 text-center">{title}</h3>
      <p className="text-foreground/70 text-center text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function PricingCard({ 
  name, 
  price, 
  description, 
  features, 
  ctaText, 
  variant,
  className 
}: { 
  name: string
  price: string
  description: string
  features: Array<{ text: string; included: boolean }>
  ctaText: string
  variant?: 'default' | 'outline'
  className?: string
}) {
  return (
    <Card className={`glass-card p-6 hover-lift ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-sm text-foreground/60">{description}</p>
      </div>
      
      <div className="mb-8">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Custom' && <span className="text-foreground/60 ml-1">/month</span>}
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              feature.included ? 'bg-muted text-muted-foreground' : 'bg-muted/30 text-muted-foreground/40'
            }`}>
              {feature.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
            <span className={`text-sm ${!feature.included && 'text-foreground/40'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      <Button variant={variant === 'outline' ? 'outline' : 'default'} className="w-full">{ctaText}</Button>
    </Card>
  )
}

function PricingCardFeatured({ 
  name, 
  price, 
  description, 
  features, 
  ctaText, 
  badge,
  className 
}: { 
  name: string
  price: string
  description: string
  features: Array<{ text: string; included: boolean; highlighted?: boolean }>
  ctaText: string
  badge?: string
  className?: string
}) {
  return (
    <Card className={`glass-premium p-8 relative ${className}`}>
      {/* Floating badge */}
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="btn-premium px-4 py-1 text-xs">{badge}</Badge>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-1">{name}</h3>
        <p className="text-sm text-foreground/60">{description}</p>
      </div>
      
      <div className="mb-8">
        <span className="text-5xl font-bold">{price}</span>
        <span className="text-foreground/60 ml-1">/month</span>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              feature.included 
                ? feature.highlighted 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
                : 'bg-muted/30 text-muted-foreground/40'
            }`}>
              {feature.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
            <span className={`text-sm ${
              feature.highlighted ? 'font-semibold' : ''
            } ${!feature.included && 'text-foreground/40'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      <Button className="w-full btn-premium">{ctaText}</Button>
    </Card>
  )
}

function TestimonialEditorial({ 
  quote, 
  author, 
  role, 
  company,
  metric 
}: { 
  quote: string
  author: string
  role: string
  company: string
  metric?: string
}) {
  return (
    <Card className="glass-card p-8 hover-lift">
      {/* Large quotation mark */}
      <div className="text-6xl text-primary/20 font-serif leading-none mb-4">"</div>
      
      {/* Quote text with editorial styling */}
      <blockquote className="text-lg text-foreground/80 mb-6 leading-relaxed italic">
        {quote}
      </blockquote>
      
      {/* Metric highlight */}
      {metric && (
        <div className="mb-6 inline-block px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-md">
          <span className="text-sm font-semibold text-primary">{metric}</span>
        </div>
      )}
      
      {/* Author info */}
      <div className="flex items-center gap-3 pt-6 border-t border-border/50">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <span className="text-sm font-bold text-foreground/60">
            {author.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold">{author}</p>
          <p className="text-xs text-foreground/60">{role}, {company}</p>
        </div>
      </div>
    </Card>
  )
}

function FooterColumn({ 
  title, 
  links 
}: { 
  title: string
  links: Array<{ label: string; href: string }>
}) {
  return (
    <div>
      <h4 className="font-semibold mb-4">{title}</h4>
      <ul className="space-y-2 text-sm text-foreground/70">
        {links.map((link, i) => (
          <li key={i}>
            <a href={link.href} className="hover:text-foreground transition-colors">{link.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function OrderingModeCard({ 
  icon, 
  title, 
  description,
  benefits,
  stat,
  color
}: { 
  icon: React.ReactNode
  title: string
  description: string
  benefits: string[]
  stat: string
  color: 'primary' | 'accent' | 'success'
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success'
  }

  return (
    <Card className="glass-premium p-8 hover-lift group">
      <div className="flex flex-col h-full">
        {/* Icon & Stat */}
        <div className="flex items-start justify-between mb-6">
          <div className={`w-14 h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <Badge variant="secondary" className="text-xs font-semibold">
            {stat}
          </Badge>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-foreground/70 leading-relaxed mb-6 flex-1">
          {description}
        </p>

        {/* Benefits List */}
        <ul className="space-y-2">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
