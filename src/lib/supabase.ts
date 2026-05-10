import { createClient, User } from '@supabase/supabase-js'
import { generateSecureOrderNumber } from './security'

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your .env file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-client-info': 'restaurant-qr-ordering'
      }
    }
  }
)

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper to get staff info for current user
export const getStaffInfo = async (userId: string) => {
  try {
    console.log('Querying restaurant_staff for user:', userId)
    
    const { data, error } = await supabase
      .from('restaurant_staff')
      .select('*, restaurants(*)')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('Supabase query error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // If no row found, return null instead of throwing
      if (error.code === 'PGRST116') {
        console.warn('No restaurant_staff record found for this user')
        return null
      }
      
      // For other errors, throw with more context
      throw new Error(`Database error: ${error.message}`)
    }
    
    console.log('Successfully fetched staff info:', data)
    return data
  } catch (error) {
    console.error('Error in getStaffInfo:', error)
    throw error
  }
}

// Order creation helper with improved security
export const createOrder = async (
  restaurantId: string,
  tableId: string | null,  // Now nullable for delivery/takeout
  items: Array<{ 
    menu_item_id: string
    quantity: number
    price_at_time_of_order: number
    customizations?: CustomizationState | null
  }>,
  notes?: string,
  orderType: 'dinein' | 'takeout' | 'delivery' = 'dinein',
  customerInfo?: {
    name?: string
    phone?: string
    email?: string
    address?: string
    instructions?: string
  },
  deliveryFee: number = 0
) => {
  // Validate inputs
  if (!restaurantId) {
    throw new Error('Restaurant ID is required')
  }

  // For dine-in orders, tableId is required
  if (orderType === 'dinein' && !tableId) {
    throw new Error('Table ID is required for dine-in orders')
  }

  if (!items || items.length === 0) {
    throw new Error('At least one item is required')
  }

  // Validate each item
  for (const item of items) {
    if (!item.menu_item_id || item.quantity < 1 || item.price_at_time_of_order < 0) {
      throw new Error('Invalid item data')
    }
  }

  // Validate customer info for delivery/takeout
  if ((orderType === 'delivery' || orderType === 'takeout') && (!customerInfo?.name || !customerInfo?.phone)) {
    throw new Error('Customer name and phone are required for delivery/takeout orders')
  }

  if (orderType === 'delivery' && !customerInfo?.address) {
    throw new Error('Delivery address is required for delivery orders')
  }

  // Calculate the start of the current day (2 AM)
  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setHours(2, 0, 0, 0) // Set to 2 AM today
  
  // If current time is before 2 AM, use yesterday's 2 AM
  if (now.getHours() < 2) {
    todayStart.setDate(todayStart.getDate() - 1)
  }

  // Count orders since 2 AM today to determine the next order number
  const { count: todayOrderCount, error: countError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantId)
    .gte('created_at', todayStart.toISOString())

  if (countError) {
    console.error('Failed to count today\'s orders:', countError)
    throw new Error('Failed to generate order number')
  }

  // Generate sequential order number (KR1, KR2, KR3...)
  const orderNumber = generateSecureOrderNumber(todayOrderCount || 0)
  
  // Calculate total with validation
  const itemsTotal = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.price_at_time_of_order
    if (isNaN(itemTotal) || itemTotal < 0) {
      throw new Error('Invalid price calculation')
    }
    return sum + itemTotal
  }, 0)
  
  const total = itemsTotal + deliveryFee

  // Sanitize notes
  const sanitizedNotes = notes?.substring(0, 500) || null // Limit length

  // Prepare order data
  const orderData: any = {
    restaurant_id: restaurantId,
    table_id: tableId,
    order_type: orderType,
    status: 'new',
    notes: sanitizedNotes,
    total,
    order_number: orderNumber
  }

  // Add delivery-specific fields if applicable
  if (orderType === 'delivery' || orderType === 'takeout') {
    orderData.customer_name = customerInfo?.name || null
    orderData.customer_phone = customerInfo?.phone || null
    orderData.customer_email = customerInfo?.email || null
    
    if (orderType === 'delivery') {
      orderData.delivery_address = customerInfo?.address || null
      orderData.delivery_instructions = customerInfo?.instructions || null
    }
  }

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()
  
  if (orderError) {
    console.error('Order creation failed:', orderError)
    throw new Error('Failed to create order. Please try again.')
  }
  
  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    price_at_time_of_order: item.price_at_time_of_order,
    customizations: item.customizations || null
  }))
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
  
  if (itemsError) {
    console.error('Order items creation failed:', itemsError)
    // Rollback: delete the order if items insertion fails
    await supabase.from('orders').delete().eq('id', order.id)
    throw new Error('Failed to create order items. Please try again.')
  }
  
  return order
}

// Help request helper with rate limiting protection
export const createHelpRequest = async (restaurantId: string, tableId: string) => {
  // Validate inputs
  if (!restaurantId || !tableId) {
    throw new Error('Restaurant ID and Table ID are required')
  }

  const { data, error } = await supabase
    .from('help_requests')
    .insert({
      restaurant_id: restaurantId,
      table_id: tableId,
      status: 'pending'
    })
    .select()
    .single()
  
  if (error) {
    console.error('Help request failed:', error)
    throw new Error('Failed to send help request. Please try again.')
  }
  return data
}

// Image upload helper with validation
export const uploadMenuImage = async (file: File, restaurantId: string) => {
  // Validate file
  if (!file) {
    throw new Error('No file provided')
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB')
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `${restaurantId}/${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('menu-images')
    .upload(filePath, file)
  
  if (uploadError) {
    console.error('Upload failed:', uploadError)
    throw new Error('Failed to upload image. Please try again.')
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('menu-images')
    .getPublicUrl(filePath)
  
  return publicUrl
}

// Type definitions for database tables
export interface Restaurant {
  id: string
  name: string
  currency: string
  is_open: boolean
  address?: string
  phone?: string
  filter_config?: {
    dietary?: boolean
    sort?: boolean
  }
  retention_config?: {
    order_retention_days?: number
    auto_cleanup_enabled?: boolean
    last_cleanup_at?: string | null
  }
  created_at: string
  updated_at: string
}

export interface Table {
  id: string
  restaurant_id: string
  table_number: number
  qr_code_id: string
  created_at: string
}

export interface Category {
  id: string
  restaurant_id: string
  name: string
  sort_order: number
  created_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string | null
  allergens: string
  prep_time: number
  is_available: boolean
  // Legacy fields - deprecated, use menu_item_customizations junction table instead
  selected_template_ids?: string[]
  customization_config?: CustomizationOption[]
  created_at: string
  updated_at: string
}

export interface CustomizationOption {
  id: string
  name: string
  type: 'addon' | 'removal' | 'substitution'
  default_price: number
  is_required?: boolean
  max_selections?: number
  sort_order?: number
}

export interface Order {
  id: string
  restaurant_id: string
  table_id: string | null  // Nullable for delivery/takeout orders
  order_type?: 'dinein' | 'takeout' | 'delivery'
  customer_name?: string | null
  customer_phone?: string | null
  delivery_address?: string | null
  delivery_fee?: number
  estimated_delivery_time?: string | null
  status: 'new' | 'preparing' | 'ready' | 'delivered'
  notes: string | null
  total: number
  order_number: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  price_at_time_of_order: number
  customizations?: CustomizationState | null
  menu_items?: {
    name: string
    image_url: string | null
    allergens: string
    price: number
  } | null
}

export interface CustomizationState {
  addons: string[]
  removals: string[]
  substitutions: Record<string, string>
  specialInstructions: string
}

export interface HelpRequest {
  id: string
  restaurant_id: string
  table_id: string
  status: 'pending' | 'dismissed'
  created_at: string
}

export interface Staff {
  id: string
  email: string
  role: 'admin' | 'staff'
  restaurant_id: string
  created_at: string
}

// Global Customization System Types (Extra-Addons)
export interface GlobalCustomization {
  id: string
  restaurant_id: string
  name: string
  type: 'addon' | 'removal' | 'substitution'
  default_price: number
  max_selections?: number
  sort_order?: number
  is_active?: boolean
  created_at: string
  updated_at: string
}

export interface MenuItemCustomizationLink {
  id: string
  menu_item_id: string
  customization_id: string
  price_override?: number | null
  is_enabled?: boolean
  sort_order?: number
  global_customizations?: GlobalCustomization | null
}

export interface DeliverySettings {
  id: string
  restaurant_id: string
  is_enabled: boolean
  delivery_fee: number
  minimum_order_amount: number
  estimated_delivery_minutes: number
  max_delivery_distance_km?: number | null
  created_at: string
  updated_at: string
}
