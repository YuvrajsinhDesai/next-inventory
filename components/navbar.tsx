"use client"

import { useRouter } from "next/navigation"
import { Bell, Search, Sun, Moon, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function Navbar() {
  const { setTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      // If no session, just redirect to landing page
      if (!session) {
        router.replace('/')
        return
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success("Signed out successfully")
      router.replace('/')
     
    } catch (error: any) {
      console.error('Sign out error:', error)
      
      // Always redirect to landing page on error to prevent being stuck
      router.replace('/')
      
      toast.error("Error during sign out", {
        description: error.message || "Please try again"
      })
    }
  }

  return (
    <div className="border-b sticky top-0 bg-background z-30">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex flex-1 items-center space-x-4">
          <div className="w-full max-w-xl hidden sm:block">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search inventory..." className="pl-8" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-5 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">A</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="sm:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-8 w-full" />
        </div>
      </div>
    </div>
  )
}