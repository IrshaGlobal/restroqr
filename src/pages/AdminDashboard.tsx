import { useState, useEffect } from 'react'
import { 
  Plus, Edit2, Trash2, Clock, AlertCircle, Download, CheckSquare, QrCode, UtensilsCrossed
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import { supabase, Restaurant, MenuItem, Category, Table, getCurrentUser, getStaffInfo, signOut } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { sanitizeInput, isValidPrice, isValidQuantity } from '@/lib/security'
import ImageUpload from '@/components/ImageUpload'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import CategoryManager from '@/components/CategoryManager'
import StaffManager from '@/components/StaffManager'
import OrderManager from '@/components/OrderManager'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import MenuItemCustomizationSelector from '@/components/MenuItemCustomizationSelector'
import GlobalCustomizationManager from '@/components/GlobalCustomizationManager'
import AdminSidebar from '@/components/AdminSidebar'
import AdminHeader from '@/components/AdminHeader'
import DashboardOverview from '@/components/DashboardOverview'
import SettingsPage from '@/components/SettingsPage'
import MobileBottomNav from '@/components/MobileBottomNav'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all') // Category filter for menu items
  
  // Navigation state
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Dialog states
  const [showAddItem, setShowAddItem] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [editingTableId, setEditingTableId] = useState<string | null>(null)
  const [editingTableNumber, setEditingTableNumber] = useState<number | null>(null)
  const [deletingTableId, setDeletingTableId] = useState<string | null>(null)
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set())
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null)
  
  // Form state for menu item
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    allergens: '',
    prep_time: '',
    image_url: '',
    is_available: true
  })

  // Initialize and fetch data
  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          toast.error('Please log in')
          return
        }

        setCurrentUserId(user.id)
        const staffInfo = await getStaffInfo(user.id)
        setRestaurantId(staffInfo.restaurant_id)
        
        // Fetch restaurant details
        const { data: restData } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', staffInfo.restaurant_id)
          .single()
        
        if (restData) setRestaurant(restData)

        // Fetch all data
        await fetchData(staffInfo.restaurant_id)
      } catch (error) {
        console.error('Initialization failed:', error)
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [])

  const fetchData = async (restId: string) => {
    try {
      // Fetch categories
      const { data: catsData } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restId)
        .order('sort_order')
      
      if (catsData) setCategories(catsData)

      // Fetch menu items
      const { data: itemsData } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restId)
        .order('created_at', { ascending: false })
      
      if (itemsData) {
        // Parse customization_config from JSONB
        const parsedItems = itemsData.map(item => ({
          ...item,
          customization_config: item.customization_config || []
        }))
        setMenuItems(parsedItems)
      }

      // Fetch tables
      const { data: tablesData } = await supabase
        .from('tables')
        .select('*')
        .eq('restaurant_id', restId)
        .order('table_number')
      
      if (tablesData) setTables(tablesData)

      // Fetch new orders count
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('restaurant_id', restId)
        .eq('status', 'new')
      
      setNewOrdersCount(count || 0)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load data')
    }
  }

  const toggleRestaurantStatus = async () => {
    if (!restaurant || !restaurantId) return
    
    // Show confirmation dialog
    setPendingStatus(!restaurant.is_open)
    setShowStatusConfirm(true)
  }

  const confirmToggleStatus = async () => {
    if (!restaurant || !restaurantId || pendingStatus === null) return
    
    try {
      const { error } = await supabase
        .from('restaurants')
        .update({ is_open: pendingStatus })
        .eq('id', restaurantId)

      if (error) throw error
      
      setRestaurant({ ...restaurant, is_open: pendingStatus })
      toast.success(`Restaurant is now ${pendingStatus ? 'OPEN' : 'CLOSED'}`)
      setShowStatusConfirm(false)
      setPendingStatus(null)
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update restaurant status')
    }
  }

  const saveMenuItem = async () => {
    if (!restaurantId) return
    
    // Validate inputs
    if (!itemForm.name.trim()) {
      toast.error('Item name is required')
      return
    }

    if (!isValidPrice(itemForm.price)) {
      toast.error('Please enter a valid price (0-99999.99)')
      return
    }

    const prepTime = parseInt(itemForm.prep_time) || 15
    if (!isValidQuantity(prepTime)) {
      toast.error('Prep time must be between 1 and 99 minutes')
      return
    }

    if (itemForm.description.length > 500) {
      toast.error('Description must be less than 500 characters')
      return
    }
    
    try {
      const itemData = {
        restaurant_id: restaurantId,
        name: sanitizeInput(itemForm.name),
        description: sanitizeInput(itemForm.description),
        price: parseFloat(itemForm.price),
        category_id: itemForm.category_id || null,
        allergens: itemForm.allergens ? sanitizeInput(itemForm.allergens) : '',
        prep_time: prepTime,
        image_url: itemForm.image_url || null,
        is_available: itemForm.is_available
      }

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id)

        if (error) throw error
        toast.success('Menu item updated')
      } else {
        // Create new item
        const { error } = await supabase
          .from('menu_items')
          .insert(itemData)

        if (error) throw error
        toast.success('Menu item added')
      }

      // Refresh data and close dialog
      await fetchData(restaurantId)
      setShowAddItem(false)
      setEditingItem(null)
      resetForm()
    } catch (error) {
      console.error('Failed to save menu item:', error)
      toast.error('Failed to save menu item')
    }
  }

  const deleteMenuItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      
      setMenuItems(items => items.filter(i => i.id !== itemId))
      toast.success('Menu item deleted')
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      toast.error('Failed to delete menu item')
    }
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

  const toggleItemAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: !currentStatus })
        .eq('id', itemId)

      if (error) throw error
      
      setMenuItems(items => 
        items.map(item => 
          item.id === itemId ? { ...item, is_available: !currentStatus } : item
        )
      )
      toast.success('Item availability updated')
    } catch (error) {
      console.error('Failed to update availability:', error)
      toast.error('Failed to update availability')
    }
  }

  const addTable = async (tableNumber: number) => {
    if (!restaurantId) return
    
    try {
      const { data, error } = await supabase
        .from('tables')
        .insert({
          restaurant_id: restaurantId,
          table_number: tableNumber,
          qr_code_id: `table-${tableNumber}`
        })
        .select()
        .single()

      if (error) throw error
      
      setTables([...tables, data])
      toast.success('Table added')
    } catch (error) {
      console.error('Failed to add table:', error)
      toast.error('Failed to add table')
    }
  }

  const deleteTable = async (tableId: string) => {
    if (!restaurantId) return
    
    try {
      // Check if table has active orders
      const { count: activeOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('table_id', tableId)
        .in('status', ['new', 'preparing', 'ready'])

      if (activeOrders && activeOrders > 0) {
        toast.error(`Cannot delete: ${activeOrders} active order(s) on this table`)
        return
      }

      const { error } = await supabase
        .from('tables')
        .delete()
        .eq('id', tableId)

      if (error) throw error
      
      setTables(tables.filter(t => t.id !== tableId))
      if (selectedTable?.id === tableId) setSelectedTable(null)
      toast.success('Table deleted')
    } catch (error: any) {
      console.error('Failed to delete table:', error)
      toast.error(error.message || 'Failed to delete table')
    }
  }

  const editTableNumber = async (tableId: string, newNumber: number) => {
    if (!restaurantId) return
    
    try {
      const { error } = await supabase
        .from('tables')
        .update({ table_number: newNumber, qr_code_id: `table-${newNumber}` })
        .eq('id', tableId)

      if (error) throw error
      
      setTables(tables.map(t => 
        t.id === tableId ? { ...t, table_number: newNumber, qr_code_id: `table-${newNumber}` } : t
      ))
      toast.success('Table number updated')
    } catch (error: any) {
      console.error('Failed to update table:', error)
      toast.error(error.message || 'Failed to update table')
    }
  }

  const generateBatchQRs = async () => {
    if (!restaurantId || tables.length === 0) return
    
    try {
      // Generate QR codes for all tables that don't have them selected
      toast.success(`Generating QR codes for ${tables.length} tables`)
      // The QR codes are generated on-demand in the UI, so we just need to select all tables
      toast.info('Click on each table to view/download its QR code')
    } catch (error: any) {
      console.error('Failed to generate batch QRs:', error)
      toast.error('Failed to generate QR codes')
    }
  }

  const resetForm = () => {
    setItemForm({
      name: '',
      description: '',
      price: '',
      category_id: '',
      allergens: '',
      prep_time: '',
      image_url: '',
      is_available: true
    })
  }

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item)
    setItemForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id || '',
      allergens: item.allergens || '',
      prep_time: item.prep_time.toString(),
      image_url: item.image_url || '',
      is_available: item.is_available
    })
    setShowAddItem(true)
  }

  const handleUpdateRestaurant = (data: Partial<Restaurant>) => {
    if (restaurant) {
      setRestaurant({ ...restaurant, ...data })
    }
  }

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return restaurantId ? (
          <DashboardOverview
            restaurantId={restaurantId}
            restaurant={restaurant}
            onToggleStatus={toggleRestaurantStatus}
            menuItemsCount={menuItems.length}
            tablesCount={tables.length}
            categoriesCount={categories.length}
            onViewSection={setActiveSection}
          />
        ) : null

      case 'orders':
        return restaurantId ? (
          <OrderManager restaurantId={restaurantId} />
        ) : null

      case 'menu-items':
        // Filter menu items by selected category
        const filteredMenuItems = selectedCategoryFilter === 'all' 
          ? menuItems 
          : menuItems.filter(item => item.category_id === selectedCategoryFilter)
        
        return (
          <div className="space-y-6">
            <div className="section-header">
              <h2 className="section-title">Menu Items</h2>
              <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingItem(null); resetForm(); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto safe-area-bottom rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <ImageUpload
                      restaurantId={restaurantId || ''}
                      currentImageUrl={itemForm.image_url}
                      onImageUploaded={(url) => setItemForm({ ...itemForm, image_url: url })}
                    />
                    
                    {/* Name & Price - Stack on Mobile, Side-by-Side on Desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={itemForm.name}
                          onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                          className="h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={itemForm.price}
                          onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={itemForm.description}
                        onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                        rows={3}
                        className="min-h-[80px]"
                      />
                    </div>

                    {/* Category & Prep Time - Stack on Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          className="w-full h-11 rounded-lg border border-input bg-background/80 backdrop-blur-sm px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          value={itemForm.category_id}
                          onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}
                        >
                          <option value="">Select category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                        <Input
                          id="prepTime"
                          type="number"
                          value={itemForm.prep_time}
                          onChange={(e) => setItemForm({ ...itemForm, prep_time: e.target.value })}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="allergens">Allergens</Label>
                      <Input
                        id="allergens"
                        placeholder="e.g., Contains: Dairy, Gluten"
                        value={itemForm.allergens}
                        onChange={(e) => setItemForm({ ...itemForm, allergens: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <Switch
                        id="available"
                        checked={itemForm.is_available}
                        onCheckedChange={(checked) => setItemForm({ ...itemForm, is_available: checked })}
                      />
                      <Label htmlFor="available">Available</Label>
                    </div>

                    {/* Extra-Addon Suggestions - Global System */}
                    {editingItem && restaurantId && (
                      <div className="pt-4 border-t border-border">
                        <MenuItemCustomizationSelector
                          menuItem={editingItem}
                          restaurantId={restaurantId}
                          onSave={async (selectedCustomizationIds) => {
                            try {
                              // Delete existing links
                              await supabase
                                .from('menu_item_customizations')
                                .delete()
                                .eq('menu_item_id', editingItem.id)
                              
                              // Insert new links if any selected
                              if (selectedCustomizationIds.length > 0) {
                                const { error } = await supabase
                                  .from('menu_item_customizations')
                                  .insert(
                                    selectedCustomizationIds.map((id, index) => ({
                                      menu_item_id: editingItem.id,
                                      customization_id: id,
                                      sort_order: index
                                    }))
                                  )
                                
                                if (error) throw error
                              }
                              
                              toast.success('Extra-addon suggestions updated')
                            } catch (error) {
                              console.error('Failed to save extra-addon suggestions:', error)
                              toast.error('Failed to save extra-addon suggestions')
                            }
                          }}
                        />
                      </div>
                    )}

                    {/* Action Buttons - Stack on Mobile */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                      <Button onClick={saveMenuItem} className="flex-1 h-11">
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddItem(false)} className="flex-1 sm:flex-none h-11 sm:w-28">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Category Filter */}
                <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  <Button
                    variant={selectedCategoryFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategoryFilter('all')}
                    className="rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0"
                  >
                    All Items ({menuItems.length})
                  </Button>
                  {categories.map(category => {
                    const count = menuItems.filter(item => item.category_id === category.id).length
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategoryFilter === category.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategoryFilter(category.id)}
                        className="rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0"
                      >
                        {category.name} ({count})
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Menu Items List - Horizontal Layout */}
            <div className="space-y-3">
              {filteredMenuItems.map(item => (
                <Card key={item.id} className="menu-item-row group hover-lift-premium transition-all duration-200">
                  <CardContent className="p-4">
                    {/* Horizontal layout with strong alignment */}
                    <div className="flex items-start gap-4">
                      {/* Image - Fixed size */}
                      <div className="w-20 h-20 rounded-lg bg-muted/50 flex-shrink-0 overflow-hidden theme-transition">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UtensilsCrossed className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content - Flexible width */}
                      <div className="flex-1 min-w-0">
                        {/* Header: Name + Price */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate text-foreground">{item.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {item.description}
                            </p>
                            {item.allergens && (
                              <p className="text-xs text-warning mt-1.5 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{item.allergens}</span>
                              </p>
                            )}
                          </div>
                          
                          {/* Price */}
                          <div className="flex-shrink-0">
                            <span className="font-bold text-xl text-primary font-mono-data">
                              {formatCurrency(item.price)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Footer: Prep Time + Actions */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.prep_time} min
                            </span>
                          </div>
                          
                          {/* Action Buttons - Hover reveal on desktop */}
                          <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditDialog(item)}
                                className="h-9 w-9 p-0 hover:bg-muted rounded-lg"
                                aria-label="Edit item"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteMenuItem(item.id)}
                                className="h-9 w-9 p-0 hover:bg-destructive/10 rounded-lg"
                                aria-label="Delete item"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                            
                            {/* Availability Switch - Always visible */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground hidden sm:inline theme-transition">
                                {item.is_available ? 'Available' : 'Unavailable'}
                              </span>
                              <Switch
                                checked={item.is_available}
                                onCheckedChange={() => toggleItemAvailability(item.id, item.is_available)}
                                className="scale-110 theme-transition"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'categories':
        return (
          <Card className="content-card">
            <CardContent className="p-6">
              <CategoryManager
                restaurantId={restaurantId || ''}
                categories={categories}
                onCategoriesChange={setCategories}
              />
            </CardContent>
          </Card>
        )

      case 'tables':
        return (
          <div className="space-y-6">
            {/* Tables Header - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="section-title">Tables & QR Codes</h2>
                <p className="text-sm text-muted-foreground mt-1 theme-transition">{tables.length} tables total</p>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {selectedTables.size > 0 && (
                  <Button variant="outline" onClick={() => setSelectedTables(new Set())} className="flex-1 sm:flex-none">
                    Clear Selection ({selectedTables.size})
                  </Button>
                )}
                <Button onClick={generateBatchQRs} disabled={tables.length === 0} className="flex-1 sm:flex-none">
                  <Download className="w-4 h-4 mr-2" />
                  Batch QR Codes
                </Button>
                <Button onClick={() => {
                  const num = prompt('Enter table number:')
                  if (num) addTable(parseInt(num))
                }} className="flex-1 sm:flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Table
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {tables.map(table => {
                const isSelected = selectedTables.has(table.id)
                const isExpanded = selectedTable?.id === table.id
                
                return (
                  <Card key={table.id} className={`${isExpanded ? 'border-primary/50 shadow-xl' : ''} ${isSelected ? 'bg-gradient-to-br from-primary/10 to-accent/10' : ''} glass-card rounded-lg`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {isSelected && <CheckSquare className="w-4 h-4 text-primary flex-shrink-0" />}
                          <h3 className="font-bold text-lg text-foreground truncate">Table {table.table_number}</h3>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (isSelected) {
                                const newSet = new Set(selectedTables)
                                newSet.delete(table.id)
                                setSelectedTables(newSet)
                              } else {
                                setSelectedTables(new Set([...selectedTables, table.id]))
                              }
                            }}
                            className="h-9 w-9 p-0 hover:bg-primary/10 rounded-lg"
                            aria-label="Select table"
                          >
                            <CheckSquare className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingTableId(table.id)
                              setEditingTableNumber(table.table_number)
                            }}
                            className="h-9 w-9 p-0 hover:bg-primary/10 rounded-lg"
                            aria-label="Edit table"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingTableId(table.id)}
                            className="h-9 w-9 p-0 hover:bg-destructive/10 rounded-xl"
                            aria-label="Delete table"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full rounded-lg shadow-md"
                        variant={isExpanded ? "default" : "outline"}
                        onClick={() => setSelectedTable(isExpanded ? null : table)}
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        {isExpanded ? 'Hide QR' : 'Show QR Code'}
                      </Button>
                      
                      {isExpanded && restaurantId && (
                        <div className="mt-4">
                          <QRCodeGenerator
                            tableNumber={table.table_number}
                            tableId={table.id}
                            restaurantId={restaurantId}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Edit Table Dialog */}
            <Dialog open={!!editingTableId} onOpenChange={(open) => !open && setEditingTableId(null)}>
              <DialogContent className="max-w-[95vw] w-full sm:max-w-md safe-area-bottom">
                <DialogHeader>
                  <DialogTitle className="text-lg">Edit Table Number</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="table-num">Table Number</Label>
                    <Input
                      id="table-num"
                      type="number"
                      value={editingTableNumber || ''}
                      onChange={(e) => setEditingTableNumber(parseInt(e.target.value))}
                      className="h-11" // Larger touch target
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button 
                      onClick={() => {
                        if (editingTableId && editingTableNumber) {
                          editTableNumber(editingTableId, editingTableNumber)
                          setEditingTableId(null)
                        }
                      }}
                      className="flex-1 h-11"
                    >
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingTableId(null)} className="flex-1 sm:flex-none h-11 sm:w-24">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Table Confirmation */}
            <ConfirmDialog
              open={!!deletingTableId}
              onOpenChange={(open) => !open && setDeletingTableId(null)}
              title="Delete Table"
              description="Are you sure you want to delete this table? This will also remove all associated orders and cannot be undone."
              onConfirm={() => {
                if (deletingTableId) {
                  deleteTable(deletingTableId)
                  setDeletingTableId(null)
                }
              }}
              variant="destructive"
              confirmText="Delete Table"
            />
          </div>
        )

      case 'staff':
        return (
          <Card className="content-card">
            <CardContent className="p-6">
              {restaurantId && currentUserId ? (
                <StaffManager 
                  restaurantId={restaurantId} 
                  currentUserId={currentUserId}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Loading staff information...
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 'analytics':
        return restaurantId ? (
          <AnalyticsDashboard restaurantId={restaurantId} />
        ) : null

      case 'addons':
        return restaurantId ? (
          <Card className="content-card">
            <CardContent className="p-6">
              <GlobalCustomizationManager restaurantId={restaurantId} />
            </CardContent>
          </Card>
        ) : null

      case 'settings':
        return restaurantId ? (
          <SettingsPage
            restaurant={restaurant}
            restaurantId={restaurantId}
            onUpdateRestaurant={handleUpdateRestaurant}
          />
        ) : null

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{ backgroundImage: 'var(--gradient-mesh)', backgroundAttachment: 'fixed' }}>
        <div className="text-center space-y-4">
          <div className="font-bold text-2xl gradient-text-premium animate-pulse">LOADING...</div>
          <div className="w-full max-w-xs h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse rounded-full" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:block">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          newOrdersCount={newOrdersCount}
        />
      </div>

      {/* Main Content Area */}
      <div className={`flex flex-col min-h-screen pb-16 lg:pb-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}>
        {/* Header */}
        <AdminHeader
          restaurant={restaurant}
          onToggleStatus={toggleRestaurantStatus}
          pageTitle={activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}
          onLogout={handleLogout}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Content */}
        <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8 xl:px-10 pb-10">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        newOrdersCount={newOrdersCount}
      />

      {/* Restaurant Status Confirmation Dialog */}
      <ConfirmDialog
        open={showStatusConfirm}
        onOpenChange={setShowStatusConfirm}
        title={pendingStatus ? "Open Restaurant" : "Close Restaurant"}
        description={
          pendingStatus 
            ? "Are you sure you want to OPEN the restaurant? Customers will be able to place orders."
            : "Are you sure you want to CLOSE the restaurant? Customers won't be able to place new orders."
        }
        onConfirm={confirmToggleStatus}
        variant={pendingStatus ? "default" : "destructive"}
        confirmText={pendingStatus ? "Open Restaurant" : "Close Restaurant"}
        cancelText="Cancel"
      />
    </div>
  )
}
