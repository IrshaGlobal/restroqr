import { Bell, LogOut, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Restaurant } from '@/lib/supabase'
import { useEffect, useState } from 'react'

interface AdminHeaderProps {
  restaurant: Restaurant | null
  onToggleStatus: () => void
  pageTitle: string
  notifications?: number
  onLogout?: () => void
  isSidebarCollapsed?: boolean
}

export default function AdminHeader({ 
  restaurant, 
  onToggleStatus, 
  pageTitle,
  notifications = 0,
  onLogout,
  isSidebarCollapsed = false
}: AdminHeaderProps) {
  const [isDark, setIsDark] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    localStorage.setItem('admin-theme', newTheme ? 'dark' : 'light')
  }
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 bg-card border-b border-border h-16 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isSidebarCollapsed ? 'lg:left-16' : 'lg:left-64'
      }`}
      style={{ willChange: 'left' }}
    >
      <div className="px-4 sm:px-6 h-full flex items-center">
        <div className="flex items-center justify-between gap-3 w-full">
          {/* Left: Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">{pageTitle}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate hidden sm:block">
              {restaurant?.name || 'Restaurant'}
            </p>
          </div>

          {/* Right: Compact Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Mobile: Status Badge + Simple Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <Badge 
                variant={restaurant?.is_open ? 'success' : 'destructive'}
                className="min-w-[50px] justify-center h-7 text-xs"
              >
                {restaurant?.is_open ? 'OPEN' : 'CLOSED'}
              </Badge>
              <Switch 
                checked={restaurant?.is_open} 
                onCheckedChange={onToggleStatus}
                className="scale-90"
              />
            </div>

            {/* Desktop: Full Status Toggle */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/50">
              <span className="text-sm font-semibold">Status:</span>
              <Badge 
                variant={restaurant?.is_open ? 'success' : 'destructive'}
                className="min-w-[60px] justify-center font-semibold"
              >
                {restaurant?.is_open ? 'OPEN' : 'CLOSED'}
              </Badge>
              <Switch 
                checked={restaurant?.is_open} 
                onCheckedChange={onToggleStatus}
              />
            </div>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 hover:bg-muted rounded-lg transition-all duration-200" 
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-muted rounded-lg transition-all duration-200">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Logout - Icon Only on Mobile */}
            <Button variant="ghost" size="sm" className="gap-2 h-10 hover:bg-muted rounded-lg transition-all duration-200 font-semibold" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
