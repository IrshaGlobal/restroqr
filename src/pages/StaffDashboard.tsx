import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, ChefHat, CheckCircle2, Truck, Volume2, VolumeX, Maximize2, Minimize2, 
  Loader2, LogOut, QrCode, ShoppingBag, MapPin, User,
  TrendingUp, Clock, Filter, Printer, Search, Moon, Sun
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { supabase, Order, OrderItem, HelpRequest, Table, getStaffInfo, getCurrentUser, signOut } from '@/lib/supabase'
import { formatCurrency, formatTime } from '@/lib/utils'
import { toast } from 'sonner'
import BatchOperations from '@/components/BatchOperations'
import TableManagementDialog from '@/components/TableManagementDialog'

// Audio context for notification sounds
const playOrderNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const frequencies = [800, 1000, 800]
    const startTime = audioContext.currentTime
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = freq
      oscillator.type = 'sine'
      
      const beepStart = startTime + (index * 0.2)
      gainNode.gain.setValueAtTime(0.5, beepStart)
      gainNode.gain.exponentialRampToValueAtTime(0.01, beepStart + 0.15)
      
      oscillator.start(beepStart)
      oscillator.stop(beepStart + 0.15)
    })
  } catch (error) {
    console.error('Failed to play order notification sound:', error)
  }
}

const playHelpRequestSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const startTime = audioContext.currentTime
    
    for (let i = 0; i < 2; i++) {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 600
      oscillator.type = 'sine'
      
      const beepStart = startTime + (i * 0.35)
      gainNode.gain.setValueAtTime(0.5, beepStart)
      gainNode.gain.exponentialRampToValueAtTime(0.01, beepStart + 0.25)
      
      oscillator.start(beepStart)
      oscillator.stop(beepStart + 0.25)
    }
  } catch (error) {
    console.error('Failed to play help request sound:', error)
  }
}

export default function StaffDashboard() {
  const [orders, setOrders] = useState<(Order & { items?: OrderItem[], tables?: Table })[]>([])
  const [helpRequests, setHelpRequests] = useState<(HelpRequest & { tables?: Table })[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [isMuted, setIsMuted] = useState(false)
  const [isKitchenMode, setIsKitchenMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [restaurantName, setRestaurantName] = useState<string>('Restaurant')
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [showTableManagement, setShowTableManagement] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDark, setIsDark] = useState(true)
  const [batchOpsOpen, setBatchOpsOpen] = useState(false)
  
  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('staff-dashboard-muted')
    if (saved) setIsMuted(JSON.parse(saved))
    
    const savedKitchenMode = localStorage.getItem('staff-dashboard-kitchen-mode')
    if (savedKitchenMode) setIsKitchenMode(JSON.parse(savedKitchenMode))
    
    // Initialize theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('staff-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      // Default to dark theme for staff dashboard
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('staff-dashboard-muted', JSON.stringify(isMuted))
  }, [isMuted])

  useEffect(() => {
    localStorage.setItem('staff-dashboard-kitchen-mode', JSON.stringify(isKitchenMode))
  }, [isKitchenMode])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    localStorage.setItem('staff-theme', newTheme ? 'dark' : 'light')
  }

  const handleLogout = async () => {
    try {
      await signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Failed to logout')
    }
  }

  // Initialize and fetch data
  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          toast.error('Please log in')
          return
        }

        const staffInfo = await getStaffInfo(user.id)
        setRestaurantId(staffInfo.restaurant_id)

        // Fetch restaurant name
        const { data: restaurantData } = await supabase
          .from('restaurants')
          .select('name')
          .eq('id', staffInfo.restaurant_id)
          .single()
        
        if (restaurantData?.name) {
          setRestaurantName(restaurantData.name)
        }

        // Fetch initial data
        await fetchOrders(staffInfo.restaurant_id)
        await fetchHelpRequests(staffInfo.restaurant_id)
      } catch (error) {
        console.error('Initialization failed:', error)
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [])

  // Subscribe to realtime updates
  useEffect(() => {
    if (!restaurantId) return

    const ordersChannel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            if (!isMuted) playOrderNotificationSound()
            toast.success(`New order received! #${(payload.new as Order).order_number}`)
          }
          fetchOrders(restaurantId)
        }
      )
      .subscribe()

    const helpChannel = supabase
      .channel('help-requests')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'help_requests', filter: `restaurant_id=eq.${restaurantId}` },
        async (payload) => {
          if (!isMuted) playHelpRequestSound()
          const tableNumber = await getTableNumberForHelpRequest(payload.new.table_id)
          toast.warning(`Help requested from Table ${tableNumber || 'N/A'}`)
          fetchHelpRequests(restaurantId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(helpChannel)
    }
  }, [restaurantId, isMuted])

  const fetchOrders = async (restId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          tables(*),
          order_items(
            *,
            menu_items(name, image_url, allergens, price)
          )
        `)
        .eq('restaurant_id', restId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Debug: Log order items count
      if (data && data.length > 0) {
        console.log('Fetched orders:', data.length)
        data.forEach(order => {
          console.log(`Order ${order.order_number}: ${(order as any).order_items?.length || 0} items`)
        })
      }
      
      const transformedData = (data || []).map(order => ({
        ...order,
        items: order.order_items || []
      }))
      
      setOrders(transformedData)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    }
  }

  const fetchHelpRequests = async (restId: string) => {
    try {
      const { data, error } = await supabase
        .from('help_requests')
        .select('*, tables!inner(*)')
        .eq('restaurant_id', restId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      setHelpRequests(data || [])
    } catch (error) {
      console.error('Failed to fetch help requests:', error)
      toast.error('Failed to load help requests')
    }
  }

  const getTableNumberForHelpRequest = async (tableId: string): Promise<number | null> => {
    try {
      const { data } = await supabase
        .from('tables')
        .select('table_number')
        .eq('id', tableId)
        .single()
      
      return data?.table_number || null
    } catch (error) {
      console.error('Failed to fetch table number:', error)
      return null
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setUpdatingStatus(orderId)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
      
      toast.success(`Order marked as ${status}`)
      if (restaurantId) fetchOrders(restaurantId)
    } catch (error) {
      console.error('Failed to update order:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const dismissAllHelpRequests = async () => {
    try {
      const { error } = await supabase
        .from('help_requests')
        .update({ status: 'dismissed' })
        .eq('restaurant_id', restaurantId)
        .eq('status', 'pending')

      if (error) throw error
      
      toast.success('All help requests dismissed')
      if (restaurantId) fetchHelpRequests(restaurantId)
    } catch (error) {
      console.error('Failed to dismiss all help requests:', error)
      toast.error('Failed to dismiss help requests')
    }
  }

  const toggleKitchenMode = () => {
    if (!isKitchenMode) {
      document.documentElement.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
    setIsKitchenMode(!isKitchenMode)
  }

  // Keyboard shortcuts
  useEffect(() => {
    if (!isKitchenMode) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      switch(e.key.toLowerCase()) {
        case 'm':
          setIsMuted(prev => {
            toast.info(prev ? 'Sound enabled' : 'Sound muted')
            return !prev
          })
          break
        case 'k':
        case 'escape':
          setIsKitchenMode(false)
          break
        case '1':
          const firstOrder = orders.find(o => o.status === 'new')
          if (firstOrder) updateOrderStatus(firstOrder.id, 'preparing')
          break
        case 'f':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.().catch(() => {})
          } else {
            document.exitFullscreen?.().catch(() => {})
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isKitchenMode, orders])

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesType = filterType === 'all' || order.order_type === filterType || (!order.order_type && filterType === 'dinein')
    
    // Search filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = !searchTerm || 
      order.order_number.toString().toLowerCase().includes(searchLower) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(searchLower)) ||
      (order.customer_phone && order.customer_phone.toLowerCase().includes(searchLower)) ||
      (order.delivery_address && order.delivery_address.toLowerCase().includes(searchLower))
    
    return matchesStatus && matchesType && matchesSearch
  })

  const stats = {
    new: orders.filter(o => o.status === 'new').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    total: orders.filter(o => {
      const today = new Date()
      const orderDate = new Date(o.created_at)
      return orderDate.toDateString() === today.toDateString()
    }).length,
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-[#121010]' : 'bg-[#FAF8F5]'
      }`}>
        <div className="text-center space-y-6">
          {/* Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`h-16 w-16 mx-auto flex items-center justify-center rounded-none ${
              isDark ? 'bg-[#1C1917]' : 'bg-white border border-[#E8E3DC]'
            }`}
          >
            <ChefHat className={`w-8 h-8 ${isDark ? 'text-[#D48A4D]' : 'text-[#B8692E]'}`} />
          </motion.div>
          
          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`text-sm uppercase tracking-widest font-semibold ${
              isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
            }`}>
              Loading Dashboard
            </div>
          </motion.div>
          
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`w-48 h-1 mx-auto rounded-none overflow-hidden ${
              isDark ? 'bg-[#1C1917]' : 'bg-[#F2EFE9]'
            }`}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className={`h-full ${
                isDark ? 'bg-[#D48A4D]' : 'bg-[#B8692E]'
              }`}
            />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${isKitchenMode ? 'p-0' : ''} ${isDark ? 'bg-[#141210]' : 'bg-[#F5F1EB]'}`}>
      {/* Hide scrollbar for filter pills */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Premium Minimalist Header */}
      {!isKitchenMode && (
        <header className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300 ${
          isDark ? 'bg-[#121010]/90 border-[#2E2A28]' : 'bg-white/90 border-[#E8E3DC]'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              
              {/* Left: Brand Identity */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                {/* QR Code Button - Compact on mobile */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-shrink-0"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTableManagement(true)}
                    className={`h-10 w-10 sm:h-12 sm:w-12 rounded-none transition-all ${
                      isDark ? 'hover:bg-[#1C1917]' : 'hover:bg-[#F2EFE9]'
                    }`}
                    title="Manage Tables & QR Codes"
                  >
                    <QrCode className="w-5 h-5" />
                  </Button>
                </motion.div>
                
                {/* Restaurant Name - Truncate on mobile */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="min-w-0 flex-1"
                >
                  <div className={`text-[10px] sm:text-xs uppercase tracking-widest mb-0.5 font-semibold ${
                    isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                  }`}>
                    STAFF DASHBOARD
                  </div>
                  <h1 className={`text-lg sm:text-2xl font-bold tracking-tight truncate ${
                    isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'
                  }`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {restaurantName}
                  </h1>
                </motion.div>
              </div>
              
              {/* Right: Action Group - Stacked on mobile, horizontal on desktop */}
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Theme Toggle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className={`h-10 w-10 sm:h-12 sm:w-12 rounded-none transition-all ${
                      isDark ? 'hover:bg-[#1C1917]' : 'hover:bg-[#F2EFE9]'
                    }`}
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </Button>
                </motion.div>
                
                {/* Sound Toggle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsMuted(!isMuted)
                      toast.info(isMuted ? 'Sound enabled' : 'Sound muted')
                    }}
                    className={`h-10 w-10 sm:h-12 sm:w-12 rounded-none transition-all ${
                      isDark ? 'hover:bg-[#1C1917]' : 'hover:bg-[#F2EFE9]'
                    }`}
                    title="Toggle Sound (M)"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 text-[#A09A95]" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-[#D48A4D]" />
                    )}
                  </Button>
                </motion.div>
                
                {/* Kitchen Mode - Primary action, emphasized */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={toggleKitchenMode}
                    className={`h-10 sm:h-12 px-3 sm:px-4 rounded-none font-semibold text-xs sm:text-sm transition-all active:scale-95 ${
                      isDark 
                        ? 'bg-[#D48A4D] hover:bg-[#E49A5D] text-white' 
                        : 'bg-[#B8692E] hover:bg-[#C47A3D] text-white'
                    }`}
                    title="Enter Kitchen Mode (K)"
                  >
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    <span className="hidden sm:inline">Kitchen Mode</span>
                    <span className="sm:hidden">Kitchen</span>
                  </Button>
                </motion.div>
                
                {/* Logout - Subtle on mobile, visible on desktop */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 }}
                  className="hidden sm:block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className={`h-12 px-4 rounded-none font-medium text-sm transition-all ${
                      isDark 
                        ? 'border-[#2E2A28] hover:border-[#F8F6F4] hover:bg-[#1C1917]' 
                        : 'border-[#E8E3DC] hover:border-[#1A1816] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Table Management Dialog */}
      {restaurantId && (
        <TableManagementDialog 
          restaurantId={restaurantId}
          open={showTableManagement}
          onOpenChange={setShowTableManagement}
        />
      )}

      {/* Help Request Banner - Refined */}
      {!isKitchenMode && helpRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-b ${
            isDark ? 'bg-[#D48A4D]/10 border-[#D48A4D]/30' : 'bg-[#B8692E]/5 border-[#B8692E]/30'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 flex items-center justify-center rounded-none ${
                isDark ? 'bg-[#D48A4D]/20' : 'bg-[#B8692E]/20'
              }`}>
                <Bell className="w-4 h-4 text-[#D48A4D] animate-pulse" />
              </div>
              <span className={`text-xs sm:text-sm font-semibold ${
                isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'
              }`}>
                {helpRequests.length} table{helpRequests.length > 1 ? 's' : ''} need help
              </span>
              <div className="flex gap-1.5">
                {helpRequests.slice(0, 5).map(request => (
                  <span key={request.id} className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-none font-semibold ${
                    isDark ? 'bg-[#D48A4D]/20 text-[#D48A4D]' : 'bg-[#B8692E]/20 text-[#B8692E]'
                  }`}>
                    T{request.tables?.table_number}
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={dismissAllHelpRequests}
              className={`text-xs sm:text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70 ${
                isDark ? 'text-[#D48A4D]' : 'text-[#B8692E]'
              }`}
            >
              Dismiss All
            </button>
          </div>
        </motion.div>
      )}

      {/* Kitchen Mode Header - Enhanced */}
      {isKitchenMode && (
        <header className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-300 ${
          isDark ? 'bg-[#121010]/95 border-[#2E2A28]' : 'bg-white/95 border-[#E8E3DC]'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              
              {/* Left: Kitchen Mode Indicator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className={`h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-none ${
                  isDark ? 'bg-[#D48A4D]/10' : 'bg-[#B8692E]/10'
                }`}>
                  <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-[#D48A4D]" />
                </div>
                <div>
                  <div className={`text-[10px] sm:text-xs uppercase tracking-widest mb-0.5 font-semibold ${
                    isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                  }`}>
                    KITCHEN MODE ACTIVE
                  </div>
                  <h1 className={`text-lg sm:text-2xl font-bold tracking-tight ${
                    isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'
                  }`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {restaurantName}
                  </h1>
                </div>
              </motion.div>
              
              {/* Right: Quick Actions & Shortcuts */}
              <div className="flex items-center gap-2 sm:gap-3">
                
                {/* Keyboard Shortcuts Hint - Desktop Only */}
                <div className={`hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold ${
                  isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                }`}>
                  <kbd className={`px-2 py-1 rounded-none font-mono ${
                    isDark ? 'bg-[#1C1917] border border-[#2E2A28]' : 'bg-[#F2EFE9] border border-[#E8E3DC]'
                  }`}>M</kbd>
                  <span>Mute</span>
                  <kbd className={`px-2 py-1 rounded-none font-mono ml-2 ${
                    isDark ? 'bg-[#1C1917] border border-[#2E2A28]' : 'bg-[#F2EFE9] border border-[#E8E3DC]'
                  }`}>K</kbd>
                  <span>Exit</span>
                </div>
                
                {/* Exit Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsKitchenMode(false)}
                    className={`h-10 sm:h-12 px-3 sm:px-4 rounded-none font-semibold text-xs sm:text-sm transition-all ${
                      isDark 
                        ? 'border-[#2E2A28] hover:border-[#F8F6F4] hover:bg-[#1C1917]' 
                        : 'border-[#E8E3DC] hover:border-[#1A1816] hover:bg-[#F2EFE9]'
                    }`}
                    title="Exit Kitchen Mode (K)"
                  >
                    <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                    <span className="hidden sm:inline">Exit Kitchen</span>
                    <span className="sm:hidden">Exit</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Orders Display - Shows in Both Normal and Kitchen Mode */}
      <main className={`max-w-7xl mx-auto ${isKitchenMode ? 'px-6 py-6' : 'px-4 sm:px-6 py-8'}`}>
        {!isKitchenMode && (
          <>
            {/* Brutalist Data Panels will be here - continuing below */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            
            {/* New Orders - Emphasized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-2 lg:col-span-1"
            >
              <Card className={`relative overflow-hidden border rounded-none transition-all duration-200 hover:-translate-y-0.5 ${
                stats.new > 0 
                  ? (isDark ? 'border-[#D48A4D]/40 bg-[#D48A4D]/5' : 'border-[#B8692E]/40 bg-[#B8692E]/5')
                  : (isDark ? 'border-[#2E2A28] bg-[#1C1917]' : 'border-[#E8E3DC] bg-white')
              }`}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-none ${
                      isDark ? 'bg-[#D48A4D]/10' : 'bg-[#B8692E]/10'
                    }`}>
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#D48A4D]" />
                    </div>
                    {stats.new > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-2 w-2 rounded-full bg-[#D48A4D] animate-pulse"
                      />
                    )}
                  </div>
                  <div className={`text-3xl sm:text-4xl font-bold tabular-nums tracking-tight mb-1 ${
                    isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'
                  }`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {stats.new}
                  </div>
                  <div className={`text-[10px] sm:text-xs uppercase tracking-widest font-semibold ${
                    isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                  }`}>
                    New Orders
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preparing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className={`border rounded-none transition-all duration-200 hover:-translate-y-0.5 ${
                isDark ? 'border-[#2E2A28] bg-[#1C1917]' : 'border-[#E8E3DC] bg-white'
              }`}>
                <CardContent className="p-4 sm:p-5">
                  <div className={`h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-none mb-3 ${
                    isDark ? 'bg-[#D48A4D]/10' : 'bg-[#B8692E]/10'
                  }`}>
                    <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-[#D48A4D]" />
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold tabular-nums tracking-tight mb-1 ${
                    isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'
                  }`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {stats.preparing}
                  </div>
                  <div className={`text-[10px] sm:text-xs uppercase tracking-widest font-semibold ${
                    isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                  }`}>
                    Cooking
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Ready */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className={`border rounded-none transition-all duration-200 hover:-translate-y-0.5 ${
                isDark ? 'border-[#2E2A28] bg-[#1C1917]' : 'border-[#E8E3DC] bg-white'
              }`}>
                <CardContent className="p-4 sm:p-5">
                  <div className={`h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-none mb-3 ${
                    isDark ? 'bg-[#3D7A5F]/10' : 'bg-[#2D5A45]/10'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#3D7A5F]" />
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold tabular-nums tracking-tight mb-1 ${
                    isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'
                  }`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {stats.ready}
                  </div>
                  <div className={`text-[10px] sm:text-xs uppercase tracking-widest font-semibold ${
                    isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                  }`}>
                    Ready
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Today Total */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className={`border rounded-none transition-all duration-200 hover:-translate-y-0.5 ${
                isDark ? 'border-[#2E2A28] bg-[#1C1917]' : 'border-[#E8E3DC] bg-white'
              }`}>
                <CardContent className="p-4 sm:p-5">
                  <div className={`h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-none mb-3 ${
                    isDark ? 'bg-[#7A8B9D]/10' : 'bg-[#5A6B7D]/10'
                  }`}>
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#7A8B9D]" />
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold tabular-nums tracking-tight mb-1 ${
                    isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'
                  }`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {stats.total}
                  </div>
                  <div className={`text-[10px] sm:text-xs uppercase tracking-widest font-semibold ${
                    isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                  }`}>
                    Today
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters and Orders */}
          <Tabs value={filterStatus} onValueChange={setFilterStatus}>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Mobile-Optimized Filter Pills with Horizontal Scrolling */}
                <div className="w-full overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                  <TabsList className={`h-12 border p-1 shadow-sm inline-flex min-w-full sm:min-w-0 transition-colors duration-300 ${isDark ? 'bg-[#1A1816] border-[#332F2C]' : 'bg-white border-[#E2DDD5]'}`}>
                    <TabsTrigger 
                      value="all" 
                      className={`rounded-none px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap data-[state=active]:text-white transition-all font-semibold ${isDark ? 'data-[state=active]:bg-accent' : 'data-[state=active]:bg-accent'}`}
                    >
                      All ({orders.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="new" 
                      className={`rounded-none px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap data-[state=active]:text-white transition-all font-semibold ${isDark ? 'data-[state=active]:bg-info' : 'data-[state=active]:bg-info'}`}
                    >
                      New ({stats.new})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preparing" 
                      className={`rounded-none px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap data-[state=active]:text-white transition-all font-semibold ${isDark ? 'data-[state=active]:bg-warning' : 'data-[state=active]:bg-warning'}`}
                    >
                      Cooking ({stats.preparing})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="ready" 
                      className={`rounded-none px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap data-[state=active]:text-white transition-all font-semibold ${isDark ? 'data-[state=active]:bg-success' : 'data-[state=active]:bg-success'}`}
                    >
                      Ready ({stats.ready})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:flex-none">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-text-muted' : 'text-text-muted'}`} />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full sm:w-64 h-12 pl-10 pr-4 rounded-none border focus:outline-none transition-colors text-sm ${isDark ? 'bg-[#1A1816] border-[#332F2C] focus:border-accent text-text-primary placeholder:text-text-muted' : 'bg-white border-[#E2DDD5] focus:border-accent text-text-primary placeholder:text-text-muted'}`}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-text-muted hover:text-text-secondary' : 'text-text-muted hover:text-text-secondary'}`}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-12 px-4 gap-2 rounded-none flex-shrink-0 font-semibold"
                      >
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {filterType === 'all' ? 'All Types' : 
                           filterType === 'dinein' ? 'Dine-in' :
                           filterType === 'delivery' ? 'Delivery' : 'Takeout'}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={`w-48 rounded-none ${isDark ? 'bg-[#1A1816] border-[#332F2C]' : 'bg-white border-[#E2DDD5]'}`}>
                      <DropdownMenuItem onClick={() => setFilterType('all')} className={isDark ? 'text-text-primary hover:bg-bg-secondary' : ''}>
                        All Types
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('dinein')} className={isDark ? 'text-text-primary hover:bg-bg-secondary' : ''}>
                        <MapPin className="w-4 h-4 mr-2" />
                        Dine-in
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('delivery')} className={isDark ? 'text-text-primary hover:bg-bg-secondary' : ''}>
                        <Truck className="w-4 h-4 mr-2" />
                        Delivery
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('takeout')} className={isDark ? 'text-text-primary hover:bg-bg-secondary' : ''}>
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Takeout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Search Results Info */}
              {searchTerm && (
                <div className={`text-sm px-2 ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
                  Found {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} matching "{searchTerm}"
                </div>
              )}
            </div>

            <TabsContent value={filterStatus} className="mt-0">
              {/* Batch Operations */}
              {restaurantId && (
                <details 
                  className="mb-6 group"
                  open={batchOpsOpen}
                  onToggle={(e) => setBatchOpsOpen((e.target as HTMLDetailsElement).open)}
                >
                  <summary className={`cursor-pointer text-sm font-semibold transition-all flex items-center gap-3 list-none p-4 rounded-none border ${
                    batchOpsOpen 
                      ? (isDark ? 'bg-accent/10 border-accent text-accent' : 'bg-accent/5 border-accent text-accent')
                      : (isDark ? 'text-text-secondary hover:text-accent border-[#332F2C] hover:border-accent' : 'text-text-secondary hover:text-accent border-[#E2DDD5] hover:border-accent')
                  }`}>
                    <div className={`h-10 w-10 flex items-center justify-center transition-all ${
                      batchOpsOpen
                        ? (isDark ? 'bg-accent/20' : 'bg-accent/10')
                        : (isDark ? 'bg-bg-secondary group-hover:bg-accent/10' : 'bg-bg-secondary group-hover:bg-accent/5')
                    }`}>
                      {batchOpsOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="m9 21 3-9 3 9"/></svg>
                      ) : (
                        <Filter className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold uppercase tracking-wider">
                        {batchOpsOpen ? 'Hide Batch Operations' : 'Show Batch Operations'}
                      </div>
                      <div className={`text-xs mt-0.5 ${isDark ? 'text-text-muted' : 'text-text-muted'}`}>
                        {batchOpsOpen ? 'Click to view order cards' : 'Click to access bulk actions'}
                      </div>
                    </div>
                    <div className={`transition-transform duration-300 ${batchOpsOpen ? 'rotate-180' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </summary>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden"
                  >
                    <BatchOperations 
                      restaurantId={restaurantId} 
                      orders={orders} 
                      onOrdersUpdated={() => fetchOrders(restaurantId)} 
                    />
                  </motion.div>
                </details>
              )}

              {/* Orders Grid - Only show when Batch Operations is closed */}
              <AnimatePresence mode="wait">
                {!batchOpsOpen && filteredOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`p-16 text-center border shadow-sm rounded-none transition-colors duration-300 ${isDark ? 'bg-card border-[#332F2C]' : 'bg-white border-[#E2DDD5]'}`}>
                      <div className={`h-20 w-20 flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-bg-secondary' : 'bg-bg-secondary'}`}>
                        <ChefHat className={`w-10 h-10 ${isDark ? 'text-text-muted' : 'text-text-muted'}`} />
                      </div>
                      <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-text-primary' : 'text-text-primary'}`}>
                        {filterStatus === 'all' ? 'No active orders' : `No ${filterStatus} orders`}
                      </h3>
                      <p className={`text-sm max-w-md mx-auto mb-4 ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
                        {filterStatus === 'all' 
                          ? 'New orders will appear here automatically when customers place them.'
                          : 'Orders will appear here when they match this status.'}
                      </p>
                      {filterType !== 'all' && (
                        <Badge variant="secondary" className="rounded-full">
                          Filtering: {filterType}
                        </Badge>
                      )}
                    </Card>
                  </motion.div>
                ) : !batchOpsOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`grid ${isKitchenMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'} gap-3 sm:gap-4`}
                  >
                    {filteredOrders.map((order, idx) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onUpdateStatus={updateOrderStatus}
                        updating={updatingStatus === order.id}
                        kitchenMode={isKitchenMode}
                        index={idx}
                        isDark={isDark}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
          </>
        )}

        {/* Kitchen Mode Orders Grid */}
        {isKitchenMode && (
          <AnimatePresence mode="wait">
            {orders.filter(o => o.status !== 'delivered').length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`p-16 text-center border shadow-sm rounded-none transition-colors duration-300 ${
                  isDark 
                    ? 'border-[#332F2C] bg-card' 
                    : 'border-[#E2DDD5] bg-white'
                }`}>
                  <div className={`h-20 w-20 flex items-center justify-center mx-auto mb-6 rounded-none ${
                    isDark ? 'bg-accent/10' : 'bg-accent/10'
                  }`}>
                    <ChefHat className={`w-10 h-10 ${isDark ? 'text-accent' : 'text-accent'}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 uppercase tracking-wide ${isDark ? 'text-text-primary' : 'text-text-primary'}`}>
                    No Active Orders
                  </h3>
                  <p className={`text-sm max-w-md mx-auto mb-4 ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
                    All orders have been completed.
                  </p>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
              >
                {orders.filter(o => o.status !== 'delivered').map((order, idx) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                    updating={updatingStatus === order.id}
                    kitchenMode={isKitchenMode}
                    index={idx}
                    isDark={isDark}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  )
}

// Modern Order Card Component
function OrderCard({ 
  order, 
  onUpdateStatus,
  updating,
  kitchenMode,
  index,
  isDark
}: {  
  order: Order & { items?: OrderItem[], tables?: Table }
  onUpdateStatus: (orderId: string, status: Order['status']) => void
  updating: boolean
  kitchenMode: boolean
  index: number
  isDark: boolean
}) {
  const [showCustomerInfo, setShowCustomerInfo] = useState(false)

  const handlePrint = () => {
    // Create a print window with just this order's receipt
    const printWindow = window.open('', '_blank', 'width=400,height=600')
    if (!printWindow) return

    const itemsHtml = order.items?.map(item => `
      <tr>
        <td style="padding: 4px 0;">${item.quantity}× ${item.menu_items?.name || 'Unknown Item'}</td>
        <td style="text-align: right; padding: 4px 0;"></td>
      </tr>
    `).join('') || ''

    const customerInfoHtml = (order.customer_name || order.customer_phone || order.delivery_address) ? `
      <div style="margin-top: 12px; padding: 8px; border: 1px dashed #ccc;">
        ${order.customer_name ? `<p style="margin: 4px 0;"><strong>${order.customer_name}</strong></p>` : ''}
        ${order.customer_phone ? `<p style="margin: 4px 0;">📞 ${order.customer_phone}</p>` : ''}
        ${order.order_type === 'delivery' && order.delivery_address ? `<p style="margin: 4px 0;">📍 ${order.delivery_address}</p>` : ''}
      </div>
    ` : ''

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order ${order.order_number}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 20px;
            max-width: 300px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #000;
            padding-bottom: 12px;
            margin-bottom: 12px;
          }
          .order-number {
            font-size: 24px;
            font-weight: bold;
            margin: 8px 0;
          }
          .meta {
            font-size: 12px;
            color: #666;
            margin: 4px 0;
          }
          .type-badge {
            display: inline-block;
            padding: 4px 8px;
            border: 1px solid #000;
            margin: 4px 0;
            font-size: 11px;
            font-weight: bold;
          }
          .items {
            margin: 12px 0;
          }
          .total {
            border-top: 2px dashed #000;
            padding-top: 12px;
            margin-top: 12px;
            font-size: 18px;
            font-weight: bold;
            text-align: right;
          }
          .notes {
            background: #f5f5f5;
            padding: 8px;
            margin: 12px 0;
            border-left: 3px solid #FF006E;
            font-size: 12px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="order-number">${order.order_number}</div>
          <div class="meta">${new Date(order.created_at).toLocaleString()}</div>
          <div class="type-badge">${order.order_type === 'delivery' ? 'DELIVERY' : order.order_type === 'takeout' ? 'TAKEOUT' : 'DINE-IN'}</div>
          ${order.tables?.table_number ? `<div class="meta">Table ${order.tables.table_number}</div>` : ''}
        </div>
        
        <div class="items">
          ${itemsHtml}
        </div>
        
        ${order.notes ? `<div class="notes"><strong>SPECIAL:</strong> ${order.notes}</div>` : ''}
        
        <div class="total">TOTAL: ${formatCurrency(order.total)}</div>
        
        ${customerInfoHtml}
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  const statusActions = {
    new: { 
      label: 'Start Preparing', 
      nextStatus: 'preparing' as const, 
      icon: <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />, 
      color: isDark ? 'bg-[#D48A4D]' : 'bg-[#B8692E]' 
    },
    preparing: { 
      label: 'Mark Ready', 
      nextStatus: 'ready' as const, 
      icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />, 
      color: isDark ? 'bg-[#D48A4D]' : 'bg-[#B8692E]' 
    },
    ready: { 
      label: 'Mark Delivered', 
      nextStatus: 'delivered' as const, 
      icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5" />, 
      color: isDark ? 'bg-[#3D7A5F]' : 'bg-[#2D5A45]' 
    },
    delivered: null,
  }

  const action = statusActions[order.status]

  // Status color mapping
  const getStatusColor = () => {
    switch(order.status) {
      case 'new': return isDark ? '#D48A4D' : '#B8692E'
      case 'preparing': return isDark ? '#D48A4D' : '#B8692E'
      case 'ready': return isDark ? '#3D7A5F' : '#2D5A45'
      default: return isDark ? '#7A8B9D' : '#5A6B7D'
    }
  }

  const statusColor = getStatusColor()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <Card className={`overflow-hidden border rounded-none shadow-sm hover:shadow-md transition-all duration-200 group ${
        order.order_type === 'delivery' 
          ? (isDark ? 'border-[#3D7A5F]/30 bg-[#1C1917]' : 'border-[#2D5A45]/30 bg-white')
          : order.status === 'new' 
          ? (isDark ? 'border-[#D48A4D]/30 bg-[#1C1917]' : 'border-[#B8692E]/30 bg-white')
          : order.status === 'preparing' 
          ? (isDark ? 'border-[#D48A4D]/30 bg-[#1C1917]' : 'border-[#B8692E]/30 bg-white')
          : order.status === 'ready' 
          ? (isDark ? 'border-[#3D7A5F]/30 bg-[#1C1917]' : 'border-[#2D5A45]/30 bg-white')
          : (isDark ? 'border-[#2E2A28] bg-[#1C1917]' : 'border-[#E8E3DC] bg-white')
      }`}>
        
        {/* Status Indicator Bar - Thicker, more prominent */}
        <div 
          className="h-1.5 sm:h-2 transition-all duration-200"
          style={{ backgroundColor: statusColor }}
        />
        
        <CardContent className={`space-y-4 sm:space-y-5 ${
          kitchenMode ? 'p-5 sm:p-6' : 'p-4 sm:p-5'
        }`}>
          {/* Header Section */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              
              {/* Order Number & Time */}
              <div className="flex items-baseline gap-2 sm:gap-3 mb-2 flex-wrap">
                <h3 className={`font-bold tracking-tight truncate ${
                  kitchenMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                } ${isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'}`} 
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  #{order.order_number}
                </h3>
                <span className={`text-xs flex items-center gap-1 flex-shrink-0 ${
                  isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                }`}>
                  <Clock className="w-3 h-3" />
                  {formatTime(new Date(order.created_at))}
                </span>
              </div>
              
              {/* Order Type & Table Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {order.order_type === 'delivery' && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'bg-[#3D7A5F]/10 text-[#3D7A5F]' : 'bg-[#2D5A45]/10 text-[#2D5A45]'
                  }`}>
                    <Truck className="w-3 h-3 mr-1" />
                    Delivery
                  </span>
                )}
                {order.order_type === 'takeout' && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'bg-[#D48A4D]/10 text-[#D48A4D]' : 'bg-[#B8692E]/10 text-[#B8692E]'
                  }`}>
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    Takeout
                  </span>
                )}
                {(order.order_type === 'dinein' || !order.order_type) && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'bg-[#7A8B9D]/10 text-[#7A8B9D]' : 'bg-[#5A6B7D]/10 text-[#5A6B7D]'
                  }`}>
                    <MapPin className="w-3 h-3 mr-1" />
                    Dine-in
                  </span>
                )}
                
                {(order.order_type === 'dinein' || !order.order_type) && order.tables?.table_number && (
                  <span className={`text-xs sm:text-sm font-semibold ${
                    isDark ? 'text-[#D0CCC8]' : 'text-[#6B6560]'
                  }`}>
                    Table {order.tables.table_number}
                  </span>
                )}
              </div>
            </div>
            
            {/* Status Badge & Print */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-none text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                order.status === 'new' 
                  ? (isDark ? 'bg-[#D48A4D]/10 text-[#D48A4D]' : 'bg-[#B8692E]/10 text-[#B8692E]')
                  : order.status === 'preparing'
                  ? (isDark ? 'bg-[#D48A4D]/10 text-[#D48A4D]' : 'bg-[#B8692E]/10 text-[#B8692E]')
                  : order.status === 'ready'
                  ? (isDark ? 'bg-[#3D7A5F]/10 text-[#3D7A5F]' : 'bg-[#2D5A45]/10 text-[#2D5A45]')
                  : (isDark ? 'bg-[#242020] text-[#A09A95]' : 'bg-[#F2EFE9] text-[#9B9590]')
              }`}>
                {order.status}
              </span>
              
              {!kitchenMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  className={`h-8 w-8 p-0 rounded-none transition-colors ${
                    isDark ? 'hover:bg-[#242020]' : 'hover:bg-[#F2EFE9]'
                  }`}
                  title="Print Receipt"
                >
                  <Printer className={`w-4 h-4 ${
                    isDark ? 'text-[#D0CCC8] hover:text-[#F8F6F4]' : 'text-[#6B6560] hover:text-[#1A1816]'
                  }`} />
                </Button>
              )}
            </div>
          </div>

          {/* Total Amount - Prominent */}
          <div className={`text-xl sm:text-2xl font-bold tracking-tight ${
            isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'
          }`} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {formatCurrency(order.total)}
          </div>

          {/* Divider */}
          <div className={`border-t ${isDark ? 'border-[#2E2A28]' : 'border-[#E8E3DC]'}`} />

          {/* Customer Info Section - Redesigned */}
          {(order.order_type === 'delivery' || order.order_type === 'takeout') && 
           (order.customer_name || order.customer_phone || order.delivery_address) && (
            <div className={`rounded-none border transition-all duration-200 ${
              order.order_type === 'delivery' 
                ? (isDark ? 'bg-[#3D7A5F]/5 border-[#3D7A5F]/20' : 'bg-[#2D5A45]/5 border-[#2D5A45]/20')
                : (isDark ? 'bg-[#D48A4D]/5 border-[#D48A4D]/20' : 'bg-[#B8692E]/5 border-[#B8692E]/20')
            }`}>
              <button
                onClick={() => setShowCustomerInfo(!showCustomerInfo)}
                className="w-full p-3 sm:p-4 flex items-center justify-between text-left"
              >
                <span className={`text-[10px] sm:text-xs uppercase tracking-widest font-semibold ${
                  isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                }`}>
                  Customer Details
                </span>
                <div className={`transition-transform duration-200 ${showCustomerInfo ? 'rotate-180' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isDark ? 'text-[#D0CCC8]' : 'text-[#6B6560]'}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
              </button>
              
              <AnimatePresence>
                {showCustomerInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2">
                      {order.customer_name && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                            isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                          }`} />
                          <span className={`font-semibold ${
                            isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'
                          }`}>{order.customer_name}</span>
                        </div>
                      )}
                      {order.customer_phone && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Bell className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                            isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                          }`} />
                          <a href={`tel:${order.customer_phone}`} className={`hover:underline ${
                            isDark ? 'text-[#D0CCC8]' : 'text-[#6B6560]'
                          }`}>{order.customer_phone}</a>
                        </div>
                      )}
                      {order.order_type === 'delivery' && order.delivery_address && (
                        <div className="flex items-start gap-2 text-xs sm:text-sm pt-1">
                          <MapPin className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 ${
                            isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
                          }`} />
                          <span className={`leading-relaxed ${
                            isDark ? 'text-[#D0CCC8]' : 'text-[#6B6560]'
                          }`}>{order.delivery_address}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {/* Order Items List - Enhanced */}
          <div className="space-y-1.5 sm:space-y-2">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 sm:py-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className={`font-bold flex-shrink-0 ${
                      kitchenMode ? 'text-lg sm:text-xl w-10 sm:w-12' : 'text-base sm:text-lg w-8 sm:w-10'
                    }`} style={{ color: statusColor }}>
                      {item.quantity}×
                    </span>
                    <span className={`font-medium truncate ${
                      kitchenMode ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                    } ${isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'}`}>
                      {item.menu_items?.name || 'Unknown Item'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-xs text-center py-2 italic ${
                isDark ? 'text-[#A09A95]' : 'text-[#9B9590]'
              }`}>
                No items in this order
              </div>
            )}
          </div>

          {/* Special Instructions - Highlighted */}
          {order.notes && (
            <div className={`border-l-2 p-3 sm:p-4 rounded-none ${
              isDark ? 'bg-[#D48A4D]/5 border-[#D48A4D]' : 'bg-[#B8692E]/5 border-[#B8692E]'
            }`}>
              <p className={`text-xs sm:text-sm font-medium ${
                isDark ? 'text-[#F8F6F4]' : 'text-[#1A1816]'
              }`}>{order.notes}</p>
            </div>
          )}

          {/* Action Button - Prominent */}
          {action && (
            <Button
              size="lg"
              className={`w-full ${
                kitchenMode ? 'h-12 sm:h-14 text-xs sm:text-sm' : 'h-11 sm:h-12 text-xs sm:text-sm'
              } font-bold uppercase tracking-wider transition-all active:scale-[0.98] rounded-none shadow-sm`}
              style={{ backgroundColor: action.color }}
              onClick={() => onUpdateStatus(order.id, action.nextStatus)}
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              ) : (
                action.icon
              )}
              <span className="ml-2 hidden sm:inline">{action.label}</span>
              <span className="ml-2 sm:hidden">{action.label.split(' ')[0]}</span>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
