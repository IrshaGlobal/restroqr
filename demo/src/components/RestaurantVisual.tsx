import { motion } from 'framer-motion'
import { QrCode, UtensilsCrossed, Bell } from 'lucide-react'

export default function RestaurantVisual() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px]">
      {/* Phone Mockup - Main Device */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateY: -15 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          rotateY: 0,
        }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="absolute top-0 left-0 md:left-10 w-64 md:w-72 flowsuite-card p-4"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        {/* Phone Screen */}
        <div className="bg-background rounded-xl overflow-hidden">
          {/* Status Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
            <div className="w-12 h-2 rounded-full bg-muted/50" />
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-muted/40" />
              <div className="w-3 h-3 rounded-full bg-muted/40" />
            </div>
          </div>
          
          {/* Menu Header */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="w-24 h-2 rounded-full bg-muted/50 mb-1" />
                <div className="w-16 h-2 rounded-full bg-muted/30" />
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/20"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-500/20 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="w-full h-2 rounded-full bg-muted/40 mb-1" />
                    <div className="w-2/3 h-2 rounded-full bg-muted/30" />
                  </div>
                  <div className="w-10 h-6 rounded-full bg-primary/30" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* QR Code Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateZ: 10 }}
        animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="absolute top-32 right-0 md:right-10 w-48 flowsuite-card p-5"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <QrCode className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold">Scan to Order</span>
          </div>
          
          {/* QR Code Visualization */}
          <div className="aspect-square rounded-lg bg-white p-3 relative overflow-hidden">
            <div className="w-full h-full grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: Math.random() > 0.3 ? 1 : 0.2 }}
                  transition={{ delay: 0.6 + i * 0.02 }}
                  className={`rounded-sm ${Math.random() > 0.5 ? 'bg-foreground' : 'bg-muted/30'}`}
                />
              ))}
            </div>
            
            {/* Scanning Animation */}
            <motion.div
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(0,102,255,0.8)]"
            />
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            Table 12
          </div>
        </div>
      </motion.div>

      {/* Order Notification */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
        className="absolute bottom-32 left-10 md:left-20 w-64 flowsuite-card p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">New Order!</span>
              <span className="text-xs text-muted-foreground">Now</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted/40 mb-1" />
            <div className="w-3/4 h-2 rounded-full bg-muted/30" />
          </div>
        </div>
      </motion.div>

      {/* Revenue Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
        className="absolute bottom-10 right-10 md:right-20 w-56 flowsuite-card p-4"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Today's Revenue</span>
            <span className="text-xs font-semibold text-green-500">+40%</span>
          </div>
          <div className="text-2xl font-bold">$2,847</div>
          <div className="flex items-end gap-1 h-12">
            {[30, 45, 35, 60, 50, 75, 65].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary/20"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Ambient Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-[80px]"
      />
    </div>
  )
}
