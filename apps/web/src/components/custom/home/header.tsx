import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b shadow-sm bg-amber-300 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2 sm:gap-0">
        
        {/* Logo and Title */}
        <div className="flex items-center gap-2 max-sm:w-full max-sm:justify-between">
          <div className="flex items-center gap-2">
            <img src="logoUni.png" alt="Logo" className="h-10 sm:h-12 w-auto" />
            <div className="text-sm sm:text-xl font-bold leading-tight">
              INDUSTRY DAY 2025<br />
              <span className="text-xs sm:text-lg font-normal">Faculty of Science</span>
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="sm:hidden">
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

        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-6 items-center">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Home</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">About</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
          <Button size="sm">Dashboard</Button>
        </nav>
      </div>
    </header>
  );
}
