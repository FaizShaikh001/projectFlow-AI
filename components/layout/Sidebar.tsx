"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BotMessageSquare,
  FolderKanban,
  Users,
  UserSquare2,
  Clock,
  ReceiptText,
  Moon,
  Sun
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "AI Assistant",
    icon: BotMessageSquare,
    href: "/ai-assistant",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
  },
  {
    label: "Resources",
    icon: UserSquare2,
    href: "/resources",
  },
  {
    label: "Timesheets",
    icon: Clock,
    href: "/timesheets",
  },
  {
    label: "Invoices",
    icon: ReceiptText,
    href: "/invoices",
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
        </div>
        <span className="font-bold text-lg tracking-tight">ProjectFlow AI</span>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
              pathname === route.href 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            <route.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{route.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 mt-auto">
        <div className="bg-muted/50 rounded-xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">AD</div>
            <div>
              <p className="text-xs font-bold leading-tight">Admin User</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">ERP Lead</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto text-muted-foreground hover:text-foreground" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
