import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b shadow-sm bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
            <img src="logoUni.png" alt="Logo" className="h-12 w-auto" />
            <span className="text-xl font-bold">INDUSTRY DAY 2025<br/><span className="text-lg">Faculty of Science</span></span>
        </div>
        

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Home</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
          <Button size="sm">Dashboard</Button>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6 space-y-4">
              <a href="#" className="block text-base text-muted-foreground hover:text-foreground">Home</a>
              <a href="#" className="block text-base text-muted-foreground hover:text-foreground">About</a>
              <a href="#" className="block text-base text-muted-foreground hover:text-foreground">Contact</a>
              <Button className="w-full">Login</Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}