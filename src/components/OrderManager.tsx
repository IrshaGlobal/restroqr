import { useState, useEffect } from 'react'
import { 
  Search, Clock, CheckCircle, XCircle, 
  Truck, Eye, ChevronDown, ChevronUp, Loader2,
  Calendar, Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ConfirmDialog from './ConfirmDialog'
import { supabase, Order, OrderItem } from '@/lib/supabase'
import { formatCurrency, formatTime } from '@/lib/utils'
import { toast } from 'sonner'

interface OrderWithDetails extends Order {
  tables?: { table_number: number } | null
  order_items?: (OrderItem & {
    menu_items?: { name: string; image_url: string | null } | null
  })[]
}

interface OrderManagerProps {
  restaurantId: string
}

export default function OrderManager({ restaurantId }: OrderManagerProps) {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!restaurantId) return
    fetchOrders()
    
    // Set up real-time subscription
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `restaurant_id=eq.${restaurantId}` },
        () => fetchOrders()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [restaurantId])

  useEffect(() => {
    applyFilters()
  }, [orders, searchTerm, statusFilter, dateFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          tables (table_number),
          order_items (
            id,
            quantity,
            price_at_time_of_order,
            menu_items (name, image_url)
          )
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...orders]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(term) ||
        order.tables?.table_number.toString().includes(term) ||
        order.notes?.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => new Date(order.created_at) >= today)
          break
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter(order => new Date(order.created_at) >= weekAgo)
          break
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter(order => new Date(order.created_at) >= monthAgo)
          break
      }
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      toast.success(`Order status updated to ${newStatus}`)
      await fetchOrders()
    } catch (error: any) {
      console.error('Failed to update status:', error)
      toast.error(error.message || 'Failed to update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const deleteOrder = async () => {
    if (!deletingOrderId) return

    try {
      // Delete order items first (cascade should handle this, but being explicit)
      await supabase
        .from('order_items')
        .delete()
        .eq('order_id', deletingOrderId)

      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', deletingOrderId)

      if (error) throw error

      toast.success('Order deleted')
      await fetchOrders()
    } catch (error: any) {
      console.error('Failed to delete order:', error)
      toast.error(error.message || 'Failed to delete order')
    } finally {
      setDeletingOrderId(null)
    }
  }

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const getStatusBorderColor = (status: string) => {
    switch(status) {
      case 'new': return 'border-l-info'
      case 'preparing': return 'border-l-warning'
      case 'ready': return 'border-l-success'
      case 'delivered': return 'border-l-muted-foreground'
      default: return 'border-l-border'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default">New</Badge>
      case 'preparing':
        return <Badge variant="secondary">Preparing</Badge>
      case 'ready':
        return <Badge className="bg-blue-500">Ready</Badge>
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="w-4 h-4" />
      case 'preparing':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'ready':
        return <CheckCircle className="w-4 h-4" />
      case 'delivered':
        return <Truck className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getOrderTotal = (order: OrderWithDetails) => {
    if (order.order_items && order.order_items.length > 0) {
      return order.order_items.reduce((sum, item) => 
        sum + (item.quantity * item.price_at_time_of_order), 0
      )
    }
    return order.total
  }

  const getStats = () => {
    const total = orders.length
    const newOrders = orders.filter(o => o.status === 'new').length
    const preparing = orders.filter(o => o.status === 'preparing').length
    const ready = orders.filter(o => o.status === 'ready').length
    const delivered = orders.filter(o => o.status === 'delivered').length
    const revenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + getOrderTotal(o), 0)

    return { total, newOrders, preparing, ready, delivered, revenue }
  }

  const stats = getStats()

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards - Premium Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 stagger-children">
        <Card className="glass-card rounded-lg hover-lift-premium">
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-foreground font-mono-data">{stats.total}</p>
            <p className="text-xs text-muted-foreground mt-1.5">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-lg hover-lift-premium">
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-warning font-mono-data">{stats.newOrders}</p>
            <p className="text-xs text-muted-foreground mt-1.5">New</p>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-lg hover-lift-premium">
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-info font-mono-data">{stats.preparing}</p>
            <p className="text-xs text-muted-foreground mt-1.5">Preparing</p>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-lg hover-lift-premium">
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-success font-mono-data">{stats.ready}</p>
            <p className="text-xs text-muted-foreground mt-1.5">Ready</p>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-lg hover-lift-premium">
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-muted-foreground font-mono-data">{stats.delivered}</p>
            <p className="text-xs text-muted-foreground mt-1.5">Delivered</p>
          </CardContent>
        </Card>
        <Card className="glass-card rounded-lg hover-lift-premium">
          <CardContent className="p-5 text-center">
            <p className="text-2xl font-bold text-foreground font-mono-data">{formatCurrency(stats.revenue)}</p>
            <p className="text-xs text-muted-foreground mt-1.5">Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Refined */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="search">Search Orders</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Order #, table, notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 h-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="date">Date Range</Label>
              <select
                id="date"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 h-10"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Hash className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No orders found.</p>
              {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setDateFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrders.has(order.id)
            const orderTotal = getOrderTotal(order)

            return (
              <Card key={order.id} className={`${getStatusBorderColor(order.status)} border-l-4 hover-lift-premium transition-all duration-200`}>
                <CardContent className="p-4">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold truncate font-mono-data">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Table {order.tables?.table_number || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-lg font-bold text-primary font-mono-data">
                        {formatCurrency(orderTotal)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="h-9 w-9 p-0 hover:bg-muted rounded-lg"
                        aria-label="Toggle order details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Order Meta */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(order.created_at)}
                    </span>
                    {order.notes && (
                      <span className="truncate max-w-full sm:max-w-xs">
                        Note: {order.notes}
                      </span>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && order.order_items && (
                    <div className="border-t pt-3 mt-3">
                      <h4 className="font-semibold mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/50 p-2 rounded gap-2">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {item.menu_items?.image_url && (
                                <img
                                  src={item.menu_items.image_url}
                                  alt={item.menu_items.name}
                                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate">{item.menu_items?.name || 'Unknown Item'}</p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} × {formatCurrency(item.price_at_time_of_order)}
                                </p>
                              </div>
                            </div>
                            <p className="font-bold flex-shrink-0">
                              {formatCurrency(item.quantity * item.price_at_time_of_order)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                    {order.status === 'new' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        disabled={updatingStatus === order.id}
                      >
                        Start Preparing
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        disabled={updatingStatus === order.id}
                      >
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        disabled={updatingStatus === order.id}
                      >
                        Mark Delivered
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowDetails(true)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeletingOrderId(order.id)}
                      disabled={updatingStatus === order.id}
                    >
                      <XCircle className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <Label>Table</Label>
                  <p className="mt-1 font-medium">Table {selectedOrder.tables?.table_number || 'N/A'}</p>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <Label>Total</Label>
                  <p className="mt-1 font-bold text-primary">
                    {formatCurrency(getOrderTotal(selectedOrder))}
                  </p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="mt-1 p-3 bg-muted rounded-md">{selectedOrder.notes}</p>
                </div>
              )}

              <div>
                <Label>Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.order_items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">{item.menu_items?.name || 'Unknown Item'}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {formatCurrency(item.price_at_time_of_order)}
                        </p>
                      </div>
                      <p className="font-bold">
                        {formatCurrency(item.quantity * item.price_at_time_of_order)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingOrderId}
        onOpenChange={(open) => !open && setDeletingOrderId(null)}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone and will also delete all order items."
        onConfirm={deleteOrder}
        variant="destructive"
        confirmText="Delete Order"
        loading={updatingStatus !== null}
      />
    </div>
  )
}
