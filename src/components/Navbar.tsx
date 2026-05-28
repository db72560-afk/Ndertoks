import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Building2, Hammer, Package, Pencil, Map, Truck, Info } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Parcela", href: "/parcels", icon: Building2 },
    { label: "Kontraktorë", href: "/contractors", icon: Hammer },
    { label: "Materiale", href: "/materials", icon: Package },
    { label: "Arkitekturë", href: "/architects", icon: Pencil },
    { label: "Gjeodezi", href: "/surveying", icon: Map },
    { label: "Logjistikë", href: "/logistics", icon: Truck },
    { label: "Rreth Nesh", href: "/about", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="NdërtoKS" className="h-10 w-10 drop-shadow-sm hover:scale-105 transition-transform" />
          <span className="hidden md:inline font-bold text-primary text-lg">NdërtoKS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Kyçu
            </Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button size="sm">Regjistrohu</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu - Modern Design */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Sliding Panel */}
          <div className="fixed top-16 left-0 right-0 z-40 border-b bg-card shadow-lg md:hidden animate-in slide-in-from-top-2 duration-300">
            <div className="container mx-auto px-4 py-6 max-h-[calc(100vh-64px)] overflow-y-auto">
              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                  Kategori
                </p>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all hover:bg-primary/10 text-foreground group"
                    >
                      <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-medium text-sm">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-border my-4" />

              {/* Theme Toggle */}
              <div className="px-3 py-3 rounded-lg bg-muted/50 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Tema</span>
                  <ThemeToggle />
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="space-y-2 pt-2">
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full font-medium hover:bg-primary/10"
                  >
                    Kyçu
                  </Button>
                </Link>
                <Link to="/auth?tab=register" onClick={() => setMobileOpen(false)} className="block">
                  <Button
                    size="sm"
                    className="w-full font-medium bg-primary hover:bg-primary/90"
                  >
                    Regjistrohu
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
