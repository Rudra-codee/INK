import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border/40 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 lg:px-12">
        <div className="flex h-16 sm:h-[72px] items-center justify-between">
          {/* Logo */}
          <div className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Ink
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-base font-medium text-foreground/90 hover:text-foreground transition-colors">
              Home
            </a>
            <a href="#features" className="text-base font-medium text-foreground/90 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#editor" className="text-base font-medium text-foreground/90 hover:text-foreground transition-colors">
              Editor
            </a>
            <a href="#docs" className="text-base font-medium text-foreground/90 hover:text-foreground transition-colors">
              Docs
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="text-base font-medium text-secondary-foreground hover:text-foreground transition-colors">
              Log In
            </a>
            <Button variant="default" size="default">
              Start Writing
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border/40">
          <div className="px-6 py-6 space-y-4">
            <a href="#" className="block text-base font-medium text-foreground/90 hover:text-foreground transition-colors">
              Home
            </a>
            <a href="#features" className="block text-base font-medium text-foreground/90 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#editor" className="block text-base font-medium text-foreground/90 hover:text-foreground transition-colors">
              Editor
            </a>
            <a href="#docs" className="block text-base font-medium text-foreground/90 hover:text-foreground transition-colors">
              Docs
            </a>
            <div className="pt-4 space-y-3">
              <a href="#" className="block text-base font-medium text-secondary-foreground hover:text-foreground transition-colors">
                Log In
              </a>
              <Button variant="default" size="default" className="w-full">
                Start Writing
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
