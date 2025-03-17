"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  BarChart3,
  LogOut,
  Menu
} from 'lucide-react'

const sidebarItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-screen bg-card border-r transition-all duration-300",
        expanded ? "w-64" : "w-20 md:w-20",
        "w-64 md:w-auto", // Always expanded on mobile
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-semibold text-2xl md:hidden">Inventory</h2>
            {expanded ? (
              <h2 className="font-semibold text-2xl hidden md:block">Inventory</h2>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary/10 hidden md:flex items-center justify-center">
                <Package className="h-5 w-5" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(curr => !curr)}
              className="h-8 w-8 hidden md:flex"
            >
              {expanded ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link href={item.href} onClick={() => setMobileOpen(false)}>
                      <span className={cn(
                        "flex items-center py-2 px-3 rounded-lg transition-all duration-200",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}>
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span className={cn(
                          "ml-3 transition-all duration-300",
                          "block md:hidden", // Always show on mobile
                          expanded ? "md:block md:opacity-100" : "md:hidden md:opacity-0 md:w-0" // Toggle on desktop
                        )}>
                          {item.name}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="border-t pt-4">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                "flex md:justify-center",
                expanded && "md:justify-start"
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className={cn(
                "ml-3 transition-all duration-300",
                "block md:hidden", // Always show on mobile
                expanded ? "md:block md:opacity-100" : "md:hidden md:opacity-0 md:w-0" // Toggle on desktop
              )}>
                Logout
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={cn(
        "ml-0 md:ml-20 transition-all duration-300",
        expanded && "md:ml-64"
      )}>
        {/* Your main content goes here */}
      </div>
    </>
  )
}