import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="h-16 border-b border-border flex items-center px-8 justify-between shrink-0 bg-background/50 backdrop-blur-md">
      <div className="hidden md:flex ml-auto flex-1 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects, customers, invoices..."
            className="w-full pl-8 bg-background"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-auto md:ml-4">
        <Button variant="outline" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center string font-medium text-primary">
          AD
        </div>
      </div>
    </header>
  )
}
