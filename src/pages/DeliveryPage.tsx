import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Clock, MapPin, Phone, User, FileText, Loader2, X, CheckCircle2, AlertCircle, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

import { useCartStore } from '@/stores/cart'
import { supabase, MenuItem, Category, Restaurant, DeliverySettings, createOrder } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

// Demo data for testing without backend (same as CustomerMenu)
const demoCategories: Category[] = [
  { id: '1', restaurant_id: 'demo', name: 'Appetizers', sort_order: 1, created_at: '' },
  { id: '2', restaurant_id: 'demo', name: 'Main Courses', sort_order: 2, created_at: '' },
  { id: '3', restaurant_id: 'demo', name: 'Desserts', sort_order: 3, created_at: '' },
  { id: '4', restaurant_id: 'demo', name: 'Beverages', sort_order: 4, created_at: '' },
]

const demoMenuItems: MenuItem[] = [
  { id: '1', restaurant_id: 'demo', category_id: '1', name: 'Crispy Calamari', description: 'Golden fried squid rings served with marinara sauce and lemon wedges', price: 12.99, image_url: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop', allergens: 'Contains: Shellfish, Gluten', prep_time: 10, is_available: true, created_at: '', updated_at: '' },
  { id: '2', restaurant_id: 'demo', category_id: '1', name: 'Bruschetta', description: 'Toasted bread topped with fresh tomatoes, basil, garlic, and balsamic glaze', price: 9.99, image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop', allergens: 'Contains: Gluten', prep_time: 8, is_available: true, created_at: '', updated_at: '' },
  { id: '4', restaurant_id: 'demo', category_id: '2', name: 'Grilled Salmon', description: 'Atlantic salmon fillet with seasonal vegetables and herb butter sauce', price: 28.99, image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop', allergens: 'Contains: Fish, Dairy', prep_time: 20, is_available: true, created_at: '', updated_at: '' },
  { id: '5', restaurant_id: 'demo', category_id: '2', name: 'Ribeye Steak', description: '12oz prime ribeye with garlic mashed potatoes and grilled asparagus', price: 34.99, image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop', allergens: 'Contains: Dairy', prep_time: 25, is_available: true, created_at: '', updated_at: '' },
  { id: '8', restaurant_id: 'demo', category_id: '3', name: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream', price: 10.99, image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop', allergens: 'Contains: Dairy, Eggs, Gluten, Caffeine', prep_time: 5, is_available: true, created_at: '', updated_at: '' },
  { id: '10', restaurant_id: 'demo', category_id: '4', name: 'Fresh Lemonade', description: 'House-made lemonade with fresh mint and a hint of ginger', price: 5.99, image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop', allergens: '', prep_time: 3, is_available: true, created_at: '', updated_at: '' },
]

export default function DeliveryPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const restaurantId = searchParams.get('restaurant') || ''
  const orderMode = searchParams.get('mode') === 'takeout' ? 'takeout' : 'delivery'
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [deliveryUnavailable, setDeliveryUnavailable] = useState(false)
  
  // Data from Supabase
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [categories, setCategories] = useState<Category[]>(demoCategories)
  const [menuItems, setMenuItems] = useState<MenuItem[]>(demoMenuItems)
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null)
  
  // Form state
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [savedAddresses, setSavedAddresses] = useState<string[]>([])
  const [saveAddress, setSaveAddress] = useState(false)

  
  const { items, addItem, updateQuantity, getTotal, getItemCount, clearCart, setOrderType, deliveryFee, setDeliveryFee } = useCartStore()
  
  // Validation helpers
  const isValidPhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '')
    if (digits.startsWith('0')) {
      return digits.length === 11
    }
    return digits.length === 10
  }
  
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  // Set order type based on mode
  useEffect(() => {
    setOrderType(orderMode === 'takeout' ? 'takeout' : 'delivery')
  }, [setOrderType, orderMode])
  
  // Load saved addresses from localStorage
  useEffect(() => {
    const addresses = localStorage.getItem('saved_delivery_addresses')
    if (addresses) {
      try {
        setSavedAddresses(JSON.parse(addresses))
      } catch (e) {
        console.error('Failed to parse saved addresses')
      }
    }
  }, [])
  
  // Fetch data from Supabase on mount
  useEffect(() => {
    if (!restaurantId) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        // Fetch restaurant details
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', restaurantId)
          .single()
        
        if (restaurantError) throw restaurantError
        
        if (restaurantData) {
          setRestaurant(restaurantData)
        }

        // Fetch delivery settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('delivery_settings')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .single()
        
        if (settingsError) {
          console.error('Failed to fetch delivery settings:', settingsError)
        } else if (settingsData) {
          setDeliverySettings(settingsData)
          setDeliveryFee(settingsData.delivery_fee)
          
          // Check if delivery is enabled
          if (!settingsData.is_enabled) {
            setDeliveryUnavailable(true)
          }
        }

        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .order('sort_order')
        
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData)
        }

        // Fetch menu items
        const { data: menuItemsData } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .eq('is_available', true)
        
        if (menuItemsData && menuItemsData.length > 0) {
          setMenuItems(menuItemsData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load menu. Using demo data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [restaurantId])
  
  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  // Handle add to cart
  const handleAddToCart = (item: MenuItem, customizations?: any) => {
    addItem(item, customizations)
  }
  

  
  // Save address to localStorage
  const saveCurrentAddress = () => {
    if (!deliveryAddress.trim()) return
    
    const newAddresses = [deliveryAddress, ...savedAddresses.filter(a => a !== deliveryAddress)].slice(0, 5)
    setSavedAddresses(newAddresses)
    localStorage.setItem('saved_delivery_addresses', JSON.stringify(newAddresses))
    toast.success('Address saved!')
  }
  
  // Validate form
  const validateForm = (): boolean => {
    if (!customerName.trim()) {
      toast.error('Please enter your name')
      return false
    }
    
    if (!customerPhone.trim()) {
      toast.error('Please enter your phone number')
      return false
    }
    
    if (!isValidPhone(customerPhone)) {
      toast.error('Phone must be 10 digits (or 11 digits if starting with 0)')
      return false
    }
    
    // Validate email if provided
    if (customerEmail.trim() && !isValidEmail(customerEmail)) {
      toast.error('Please enter a valid email address')
      return false
    }
    
    // Address is required for delivery, optional for takeout
    if (orderMode === 'delivery' && !deliveryAddress.trim()) {
      toast.error('Please enter your delivery address')
      return false
    }
    
    // Check minimum order amount
    const subtotal = getTotal() - deliveryFee
    if (deliverySettings && subtotal < deliverySettings.minimum_order_amount) {
      toast.error(`Minimum order amount is ${formatCurrency(deliverySettings.minimum_order_amount)}`)
      return false
    }
    
    return true
  }
  
  // Place order
  const handlePlaceOrder = async () => {
    if (!validateForm()) return
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    if (!restaurantId) {
      toast.error('Restaurant ID is missing')
      return
    }
    
    setPlacingOrder(true)
    
    try {
      // Prepare order items
      const orderItems = items.map(cartItem => {
        let priceAtOrder = parseFloat(cartItem.item.price.toString())
        
        if (cartItem.customizations && cartItem.item.customization_config) {
          cartItem.item.customization_config.forEach(option => {
            if (cartItem.customizations!.addons.includes(option.id)) {
              priceAtOrder += option.default_price
            }
            if (option.type === 'substitution' && Object.values(cartItem.customizations!.substitutions).includes(option.id)) {
              priceAtOrder += option.default_price
            }
          })
        }
        
        return {
          menu_item_id: cartItem.item.id,
          quantity: cartItem.quantity,
          price_at_time_of_order: priceAtOrder,
          customizations: cartItem.customizations || null
        }
      })
      
      // Create order
      const order = await createOrder(
        restaurantId,
        null, // No table for delivery/takeout
        orderItems,
        deliveryInstructions,
        orderMode === 'takeout' ? 'takeout' : 'delivery',
        {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          address: orderMode === 'delivery' ? deliveryAddress : undefined,
          instructions: deliveryInstructions
        },
        orderMode === 'delivery' ? deliveryFee : 0
      )
      
      // Save address if requested
      if (saveAddress) {
        saveCurrentAddress()
      }
      
      setOrderId(order.id)
      setOrderNumber(order.order_number)
      setOrderPlaced(true)
      setShowCart(false)
      clearCart()
      
      toast.success('Order placed successfully!')
    } catch (error) {
      console.error('Failed to place order:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order. Please try again.'
      toast.error(errorMessage)
    } finally {
      setPlacingOrder(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center" style={{
        backgroundImage: 'linear-gradient(#E2DDD5 1px, transparent 1px), linear-gradient(90deg, #E2DDD5 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: 'center center'
      }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#C47A3D]" />
      </div>
    )
  }
  
  if (deliveryUnavailable) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center p-6" style={{
        backgroundImage: 'linear-gradient(#E2DDD5 1px, transparent 1px), linear-gradient(90deg, #E2DDD5 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: 'center center'
      }}>
        <Card className="max-w-md w-full text-center p-8 border border-[#E2DDD5] shadow-[0_2px_12px_rgba(0,0,0,0.04)]" style={{ borderRadius: 0 }}>
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Delivery Currently Unavailable</h1>
          <p className="text-muted-foreground mb-6">We're not accepting delivery orders at the moment. Please check back later or consider dining in.</p>
          <Button onClick={() => navigate('/food')} variant="outline" style={{ borderRadius: 0 }}>
            Back to Home
          </Button>
        </Card>
      </div>
    )
  }
  
  if (orderPlaced && orderId) {
    return (
      <div className="min-h-screen bg-[#F5F1EB]" style={{
        backgroundImage: 'linear-gradient(#E2DDD5 1px, transparent 1px), linear-gradient(90deg, #E2DDD5 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: 'center center'
      }}>
        <div className="container mx-auto px-6 py-8 max-w-lg">
          <Card className="p-8 text-center animate-enter border border-[#E2DDD5] shadow-[0_2px_12px_rgba(0,0,0,0.04)]" style={{ borderRadius: 0 }}>
            <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-[#2D6A4F]" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Order Placed!</h1>
            <p className="text-muted-foreground mb-6">Your {orderMode} order has been received</p>
            
            <div className="bg-white/50 border border-[#E2DDD5] p-6 mb-6" style={{ borderRadius: 0 }}>
              <p className="text-sm text-muted-foreground mb-2">Order Number</p>
              <p className="text-5xl font-bold text-[#C47A3D]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{orderNumber || '0000'}</p>
              <p className="text-sm text-muted-foreground mt-2">Estimated {orderMode === 'takeout' ? 'Pickup' : 'Delivery'}: {deliverySettings?.estimated_delivery_minutes || 30}-45 min</p>
            </div>
            
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center gap-3 p-3 bg-white border border-[#E2DDD5]" style={{ borderRadius: 0 }}>
                <User className="w-5 h-5 text-[#8A857B]" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium text-[#0A0A0A]">{customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-[#E2DDD5]" style={{ borderRadius: 0 }}>
                <Phone className="w-5 h-5 text-[#8A857B]" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-[#0A0A0A]">{customerPhone}</p>
                </div>
              </div>
              {orderMode === 'delivery' && (
                <div className="flex items-start gap-3 p-3 bg-white border border-[#E2DDD5]" style={{ borderRadius: 0 }}>
                  <MapPin className="w-5 h-5 text-[#8A857B] mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery Address</p>
                    <p className="font-medium text-[#0A0A0A]">{deliveryAddress}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Button onClick={() => { setOrderPlaced(false); setOrderId(null); }} className="w-full bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white" style={{ borderRadius: 0 }}>
              Place Another Order
            </Button>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#F5F1EB] pb-24 pt-8 px-6 md:px-8 lg:px-12 relative" style={{
      backgroundImage: 'linear-gradient(#E2DDD5 1px, transparent 1px), linear-gradient(90deg, #E2DDD5 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      backgroundPosition: 'center center'
    }}>
      {/* Centered Card Container - Main Content */}
      <div className="max-w-[960px] mx-auto bg-white border border-[#E2DDD5] shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-[80vh] flex flex-col">
        {/* HEADER - Ultra-Minimal: Search Only */}
        <header className="sticky top-0 z-40 bg-white border-b border-[#E2DDD5] px-6 py-4">
          {/* SEARCH - Sharp & Crisp */}
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#8A857B] pointer-events-none" />
            <Input
              placeholder="Search dishes, ingredients, or preferences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-8 h-[44px] text-[14px] bg-white border-[#E2DDD5] focus:border-[#0A0A0A] focus:ring-0 focus:ring-offset-0 transition-all placeholder:text-[#8A857B]" style={{ borderRadius: 0 }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A857B] hover:text-[#0A0A0A] transition-colors p-0.5"
              >
                <X className="w-[14px] h-[14px]" />
              </button>
            )}
            
            {/* Search count indicator */}
            {searchQuery && filteredItems.length > 0 && (
              <div className="absolute -bottom-5 left-0 text-[10px] text-[#8A857B]">
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </header>

        {/* CATEGORIES - Small Sharp Cards */}
        <nav className="flex gap-3 overflow-x-auto px-6 py-5 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 snap-start w-[88px] h-[88px] border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-[2px] focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 ${
              selectedCategory === 'all' 
                ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white hover:border-[#0A0A0A]' 
                : 'bg-white border-[#E2DDD5] text-[#0A0A0A] hover:border-[#0A0A0A]'
            }`}
          >
            <span className={selectedCategory === 'all' ? 'text-white opacity-100' : 'text-[#0A0A0A] opacity-80'}>
              <Search className="w-4 h-4" />
            </span>
            <span className={`text-[11px] font-bold tracking-wide uppercase leading-none ${selectedCategory === 'all' ? 'text-white' : 'text-[#0A0A0A]'}`}>All</span>
            <span className={`text-[10px] ${selectedCategory === 'all' ? 'text-white opacity-100' : 'text-[#0A0A0A] opacity-60'}`}>
              {menuItems.length}
            </span>
          </button>
          
          {categories.map(cat => {
            // Map category names to icons
            const getCategoryIcon = (name: string) => {
              const lowerName = name.toLowerCase()
              if (lowerName.includes('biryani') || lowerName.includes('rice')) return <Search className="w-4 h-4" />
              if (lowerName.includes('tandoor') || lowerName.includes('grill')) return <Search className="w-4 h-4" />
              if (lowerName.includes('curry') || lowerName.includes('bowl')) return <Search className="w-4 h-4" />
              if (lowerName.includes('seafood') || lowerName.includes('fish')) return <Search className="w-4 h-4" />
              if (lowerName.includes('veg')) return <Search className="w-4 h-4" />
              return <Search className="w-4 h-4" />
            }
            
            const itemCount = menuItems.filter(item => item.category_id === cat.id).length
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 snap-start w-[88px] h-[88px] border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-[2px] focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 ${
                  selectedCategory === cat.id 
                    ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white hover:border-[#0A0A0A]' 
                    : 'bg-white border-[#E2DDD5] text-[#0A0A0A] hover:border-[#0A0A0A]'
                }`}
              >
                <span className={selectedCategory === cat.id ? 'text-white opacity-100' : 'text-[#0A0A0A] opacity-80'}>
                  {getCategoryIcon(cat.name)}
                </span>
                <span className={`text-[11px] font-bold tracking-wide uppercase leading-none ${selectedCategory === cat.id ? 'text-white' : 'text-[#0A0A0A]'}`}>{cat.name}</span>
                <span className={`text-[10px] ${selectedCategory === cat.id ? 'text-white opacity-100' : 'text-[#0A0A0A] opacity-60'}`}>
                  {itemCount}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Menu Items Grid */}
        <main className="flex-1 px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Card 
              key={item.id} 
              className={`overflow-hidden border border-[#E2DDD5] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-[#0A0A0A] ${!item.is_available ? 'opacity-60' : ''} animate-in fade-in slide-in-from-bottom-4`}
              style={{ 
                borderRadius: 0,
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className="relative">
                {/* Image with 4:3 aspect ratio */}
                {item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full aspect-[4/3] object-cover transition-transform duration-[400ms] cursor-pointer hover:scale-[1.02]" 
                    loading="lazy"
                  />
                )}
                
                {/* Prep Time Badge - Sharp, top-left */}
                {item.prep_time && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white border border-[#E2DDD5] text-[10px] font-bold tracking-widest uppercase text-[#0A0A0A] z-[2]">
                    {item.prep_time} min
                  </span>
                )}
                
                {/* Unavailable overlay */}
                {!item.is_available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <Badge variant="destructive" className="text-base px-4 py-2 font-semibold">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                {/* Item name and price */}
                <div className="flex justify-between items-baseline gap-3 mb-3 pb-3 border-b border-[#E2DDD5]">
                  <h3 className="font-semibold text-[18px] tracking-tight leading-tight flex-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{item.name}</h3>
                  <span className="font-semibold text-[16px] text-[#0A0A0A] flex-shrink-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{formatCurrency(item.price)}</span>
                </div>
                
                {/* Description */}
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 line-clamp-2 flex-1">{item.description}</p>
                
                {/* Meta info */}
                {item.allergens && (
                  <p className="text-[11px] font-medium text-muted-foreground mb-5 italic">{item.allergens}</p>
                )}
                
                <Button 
                  size="sm" 
                  variant={item.is_available ? "default" : "secondary"}
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.is_available}
                  className={`w-full h-[40px] text-[12px] font-bold tracking-wide uppercase transition-all active:scale-[0.98] ${
                    item.is_available 
                      ? 'bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white' 
                      : ''
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  {item.is_available ? 'Add' : 'Unavailable'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No items found</p>
          </div>
        )}
      </main>
      </div>
      
      {/* Blank Space - Shows Background */}
      <div className="py-8"></div>
      
      {/* Footer Card - Separate from Main Card */}
      <div className="max-w-[960px] mx-auto bg-white border border-[#E2DDD5] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <footer className="w-full py-0.5 flex-1 flex items-center justify-center">
        <div className="w-full text-center px-4">
          <h2 
            className="font-bold text-[#0A0A0A] leading-none tracking-tight"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.5rem, 5vw, 8rem)',
              fontStyle: 'italic',
              fontWeight: 600
            }}
          >
            {restaurant?.name || 'Restaurant'}
          </h2>
          {deliverySettings && (
            <p className="text-xs text-muted-foreground mt-2">
              {orderMode === 'takeout' ? 'Takeout' : 'Delivery'} • Est. {deliverySettings.estimated_delivery_minutes} min
            </p>
          )}
        </div>
      </footer>
      </div>
      
      {/* Floating Cart Button */}
      {getItemCount() > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#0A0A0A] text-white shadow-[0_2px_8px_rgba(196,122,61,0.2)] hover:bg-[#1A1A1A] transition-all active:scale-[0.98] min-h-[56px] px-6 flex items-center gap-3"
          aria-label={`Shopping cart with ${getItemCount()} items`}
          role="button"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#C47A3D] text-xs flex items-center justify-center font-bold">
              {getItemCount()}
            </span>
          </div>
          <div className="text-left">
            <p className="text-xs opacity-80">View Cart</p>
            <p className="font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{formatCurrency(getTotal())}</p>
          </div>
        </button>
      )}
      
      {/* Cart Bottom Sheet - Responsive Single Page */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowCart(false)}>
          <div 
            className="absolute inset-x-0 bottom-0 bg-white max-h-[92vh] overflow-hidden animate-slide-up shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
            style={{ borderRadius: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-pointer" onClick={() => setShowCart(false)}>
              <div className="w-12 h-1 bg-[#E2DDD5]" />
            </div>

            <div className="flex flex-col" style={{ maxHeight: '92vh' }}>
              {/* Header - Sharp & Clean */}
              <div className="px-6 pb-4 border-b border-[#E2DDD5] flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#0A0A0A] tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Your Order</h2>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCart(false)} 
                    className="min-h-[36px] border-[#E2DDD5] hover:border-[#0A0A0A] text-sm font-medium"
                    style={{ borderRadius: 0 }}
                  >
                    Add more
                  </Button>
                </div>
              </div>
              
              {/* Responsive Content - Two Columns on Desktop, Stacked on Mobile */}
              <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(92vh - 80px)' }}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left Column - Cart Items & Customer Info (75% on desktop) */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Cart Items Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[#0A0A0A] tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          Cart Items
                          <span className="ml-2 text-sm font-normal text-muted-foreground">({getItemCount()} {getItemCount() === 1 ? 'item' : 'items'})</span>
                        </h3>
                        {items.length > 0 && (
                          <button
                            onClick={() => {
                              if (confirm('Clear all items from cart?')) {
                                clearCart()
                              }
                            }}
                            className="text-xs text-muted-foreground hover:text-red-600 transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      {items.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border border-[#E2DDD5] bg-white">
                          <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                          <p>Your cart is empty</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {items.map((cartItem) => (
                            <div key={cartItem.item.id} className="flex items-center gap-3 p-4 border border-[#E2DDD5] bg-white">
                              <div className="flex-1">
                                <p className="font-semibold text-[#0A0A0A]">{cartItem.item.name}</p>
                                <p className="text-sm text-muted-foreground">{formatCurrency(cartItem.item.price)} x {cartItem.quantity}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)} className="min-h-[36px] min-w-[36px] p-0 h-9 w-9 border-[#E2DDD5] hover:border-[#0A0A0A]" style={{ borderRadius: 0 }}>
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-bold text-base">{cartItem.quantity}</span>
                                <Button size="sm" variant="outline" onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)} className="min-h-[36px] min-w-[36px] p-0 h-9 w-9 border-[#E2DDD5] hover:border-[#0A0A0A]" style={{ borderRadius: 0 }}>
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Customer Information Section */}
                    <div>
                      <h3 className="text-lg font-bold text-[#0A0A0A] mb-4 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Customer Information</h3>
                      <div className="space-y-4 border border-[#E2DDD5] bg-white p-6">
                        <div>
                          <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            Name *
                          </label>
                          <Input
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Your full name"
                            className="bg-white border-[#E2DDD5] text-[#0A0A0A] placeholder:text-muted-foreground focus:border-[#0A0A0A]"
                            style={{ borderRadius: 0 }}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            Phone *
                          </label>
                          <Input
                            value={customerPhone}
                            onChange={(e) => {
                              // Only allow numbers, spaces, dashes, plus sign
                              const value = e.target.value.replace(/[^0-9\s\-\+]/g, '')
                              setCustomerPhone(value)
                            }}
                            placeholder="e.g., 555-123-4567"
                            type="tel"
                            pattern="[1-9][0-9]{9}"
                            className={`bg-white border-[#E2DDD5] text-[#0A0A0A] placeholder:text-muted-foreground focus:border-[#0A0A0A] ${
                              customerPhone && !isValidPhone(customerPhone) ? 'border-red-500' : ''
                            }`}
                            style={{ borderRadius: 0 }}
                          />
                          {customerPhone && !isValidPhone(customerPhone) && (
                            <p className="text-xs text-red-500 mt-1">Must be 10 digits (or 11 if starting with 0)</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            Email (Optional)
                          </label>
                          <Input
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="your@email.com"
                            type="email"
                            className={`bg-white border-[#E2DDD5] text-[#0A0A0A] placeholder:text-muted-foreground focus:border-[#0A0A0A] ${
                              customerEmail && !isValidEmail(customerEmail) ? 'border-red-500' : ''
                            }`}
                            style={{ borderRadius: 0 }}
                          />
                          {customerEmail && !isValidEmail(customerEmail) && (
                            <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {orderMode === 'takeout' ? 'Pickup Location (Optional)' : 'Delivery Address *'}
                          </label>
                          <Textarea
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder={orderMode === 'takeout' ? 'Where will you pick up? (optional)' : 'Enter your full delivery address'}
                            rows={3}
                            className="bg-white border-[#E2DDD5] text-[#0A0A0A] placeholder:text-muted-foreground focus:border-[#0A0A0A]"
                            style={{ borderRadius: 0 }}
                          />
                          
                          {/* Saved Addresses */}
                          {savedAddresses.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-muted-foreground mb-2">Saved Addresses:</p>
                              <div className="space-y-2">
                                {savedAddresses.map((addr, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setDeliveryAddress(addr)}
                                    className="w-full text-left text-sm p-2 border border-[#E2DDD5] hover:border-[#0A0A0A] bg-white text-[#0A0A0A] transition-colors"
                                    style={{ borderRadius: 0 }}
                                  >
                                    {addr.substring(0, 60)}{addr.length > 60 ? '...' : ''}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="saveAddress"
                            checked={saveAddress}
                            onChange={(e) => setSaveAddress(e.target.checked)}
                            className="w-4 h-4 accent-[#C47A3D]"
                          />
                          <label htmlFor="saveAddress" className="text-sm text-muted-foreground">Save this address for next time</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Order Summary (25% on desktop, sticky) */}
                  <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-0 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#0A0A0A] mb-4 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Order Summary</h3>
                        <div className="border border-[#E2DDD5] bg-white p-4 space-y-3">
                          {/* Items List */}
                          <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {items.map((cartItem) => (
                              <div key={cartItem.item.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{cartItem.item.name} x{cartItem.quantity}</span>
                                <span className="font-semibold text-[#0A0A0A]">{formatCurrency(cartItem.item.price * cartItem.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Totals */}
                          <div className="border-t border-[#E2DDD5] pt-3 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span className="text-[#0A0A0A]">{formatCurrency(getTotal() - deliveryFee)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Delivery Fee</span>
                              <span className="text-[#0A0A0A]">{formatCurrency(deliveryFee)}</span>
                            </div>
                            {deliverySettings && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Min. Order</span>
                                <span className="text-[#0A0A0A]">{formatCurrency(deliverySettings.minimum_order_amount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t border-[#E2DDD5] pt-2">
                              <span className="text-[#0A0A0A]">Total</span>
                              <span className="text-[#C47A3D] text-xl">{formatCurrency(getTotal())}</span>
                            </div>
                          </div>
                          
                          {/* Estimated Time */}
                          {deliverySettings && (
                            <div className="flex items-center gap-2 p-3 bg-[#F5F1EB]/50 border border-[#E2DDD5]">
                              <Clock className="w-5 h-5 text-[#C47A3D]" />
                              <div>
                                <p className="text-sm font-semibold text-[#0A0A0A]">Estimated {orderMode === 'takeout' ? 'Pickup' : 'Delivery'}</p>
                                <p className="text-xs text-muted-foreground">{deliverySettings.estimated_delivery_minutes}-45 minutes</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Special Instructions */}
                          <div>
                            <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-muted-foreground">
                              <FileText className="w-4 h-4" />
                              Special Instructions (Optional)
                            </label>
                            <Textarea
                              value={deliveryInstructions}
                              onChange={(e) => setDeliveryInstructions(e.target.value)}
                              placeholder="Add any special requests or instructions"
                              rows={2}
                              className="bg-white border-[#E2DDD5] text-[#0A0A0A] placeholder:text-muted-foreground focus:border-[#0A0A0A] w-full"
                              style={{ borderRadius: 0 }}
                            />
                          </div>
                          
                          {/* Place Order Button */}
                          <Button 
                            className="w-full bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white disabled:opacity-50 mt-4"
                            onClick={handlePlaceOrder}
                            disabled={placingOrder || items.length === 0}
                            style={{ borderRadius: 0 }}
                          >
                            {placingOrder ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Placing...
                              </>
                            ) : (
                              <>
                                Place Order
                                <CheckCircle2 className="w-4 h-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
