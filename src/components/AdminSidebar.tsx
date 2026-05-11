import { useState } from 'react'
import { 
  LayoutDashboard, ShoppingCart, UtensilsCrossed, LayoutGrid, 
  Users, BarChart3, Settings, ChevronLeft, ChevronRight,
  FolderOpen, Tag, SlidersHorizontal
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number
  children?: NavItem[]
}

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  newOrdersCount?: number
}

export default function AdminSidebar({ 
  activeSection, 
  onSectionChange, 
  isCollapsed, 
  onToggleCollapse,
  newOrdersCount = 0
}: AdminSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['menu']))

  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus)
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId)
    } else {
      newExpanded.add(menuId)
    }
    setExpandedMenus(newExpanded)
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      badge: newOrdersCount
    },
    {
      id: 'menu',
      label: 'Menu Management',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      children: [
        { id: 'menu-items', label: 'Menu Items', icon: <FolderOpen className="w-4 h-4" /> },
        { id: 'categories', label: 'Categories', icon: <Tag className="w-4 h-4" /> },
        { id: 'addons', label: 'Extra-Addons', icon: <SlidersHorizontal className="w-4 h-4" /> },
      ]
    },
    {
      id: 'tables',
      label: 'Tables & QR Codes',
      icon: <LayoutGrid className="w-5 h-5" />
    },
    {
      id: 'staff',
      label: 'Staff Management',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ]

  const handleNavClick = (itemId: string, hasChildren?: boolean) => {
    if (hasChildren) {
      // If sidebar is collapsed, expand it first
      if (isCollapsed) {
        onToggleCollapse()
      }
      toggleMenu(itemId)
    } else {
      onSectionChange(itemId)
    }
  }

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 z-50 bg-card border-r border-border flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isCollapsed 
          ? 'w-16' 
          : 'w-64'
      }`}
      style={{ willChange: 'width' }}
    >
      {/* Logo/Brand Section */}
      <div className={`px-3 py-4 border-b border-border flex items-center transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-1 animate-fade-in">
            <div className="w-9 h-9 bg-gradient-primary flex items-center justify-center rounded-lg">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">Admin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="min-h-[32px] min-w-[32px] p-0 hover:bg-muted rounded-lg"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 transition-transform duration-200" />
          ) : (
            <ChevronLeft className="w-4 h-4 transition-transform duration-200" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = activeSection === item.id || 
            (item.children?.some(child => child.id === activeSection))
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedMenus.has(item.id)

          return (
            <div key={item.id}>
              <button
                onClick={() => handleNavClick(item.id, hasChildren)}
                className={`sidebar-item w-full transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isActive ? 'sidebar-item-active' : ''
                } ${isCollapsed ? 'sidebar-item-collapsed' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0 transition-transform duration-200">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left transition-opacity duration-200">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {item.badge}
                      </Badge>
                    )}
                    {hasChildren && (
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isExpanded ? 'rotate-90' : ''}`} 
                      />
                    )}
                  </>
                )}
              </button>

              {/* Submenu Items */}
              {hasChildren && !isCollapsed && isExpanded && (
                <div className="ml-4 mt-1 space-y-1 pl-2 animate-slide-in">
                  {item.children!.map((child) => {
                    const isChildActive = activeSection === child.id
                    return (
                      <button
                        key={child.id}
                        onClick={() => onSectionChange(child.id)}
                        className={`sidebar-item w-full text-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          isChildActive ? 'sidebar-item-active' : ''
                        }`}
                      >
                        <span className="flex-shrink-0 transition-transform duration-200">{child.icon}</span>
                        <span className="flex-1 text-left transition-opacity duration-200">{child.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Profile Section (Bottom) */}
      {!isCollapsed && (
        <div className="px-3 py-4 border-t border-border animate-fade-in">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="w-10 h-10 bg-gradient-primary flex items-center justify-center rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground transition-colors duration-200">Admin User</p>
              <p className="text-xs text-muted-foreground truncate transition-colors duration-200">Manager</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
