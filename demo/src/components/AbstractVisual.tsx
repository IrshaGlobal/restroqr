import { motion } from 'framer-motion'

export default function AbstractVisual() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px]">
      {/* Floating Card 1 - Main Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 10, rotateY: -10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          rotateX: 0,
          rotateY: 0,
        }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="absolute top-10 left-0 md:left-10 w-72 md:w-80 flowsuite-card p-6"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-20 h-3 rounded-full bg-primary/30" />
            <div className="w-8 h-8 rounded-lg bg-primary/20" />
          </div>
          <div className="space-y-2">
            <div className="w-full h-24 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-500/20" />
            <div className="flex gap-2">
              <div className="flex-1 h-16 rounded-lg bg-muted/50" />
              <div className="flex-1 h-16 rounded-lg bg-muted/50" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-2 rounded-full bg-muted/40" />
            <div className="w-12 h-2 rounded-full bg-primary/40" />
          </div>
        </div>
      </motion.div>

      {/* Floating Card 2 - Analytics */}
      <motion.div
        initial={{ opacity: 0, x: 40, rotateZ: 5 }}
        animate={{ opacity: 1, x: 0, rotateZ: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="absolute top-40 right-0 md:right-10 w-64 md:w-72 flowsuite-card p-5"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-primary/60" />
            </div>
            <div className="flex-1">
              <div className="w-24 h-2 rounded-full bg-muted/50 mb-2" />
              <div className="w-16 h-2 rounded-full bg-muted/30" />
            </div>
          </div>
          <div className="flex items-end gap-1 h-20">
            {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary/20"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Card 3 - Notification */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="absolute bottom-20 left-10 md:left-20 w-56 flowsuite-card p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <div className="w-4 h-4 rounded-full bg-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="w-full h-2 rounded-full bg-muted/50 mb-2" />
            <div className="w-3/4 h-2 rounded-full bg-muted/30" />
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
