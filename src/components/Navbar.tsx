import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Parcela", href: "/parcels" },
    { label: "Kontraktorë", href: "/contractors" },
    { label: "Materiale", href: "/materials" },
    { label: "Arkitekturë&Projektim", href: "/architects" },
    { label: "Gjeodezi", href: "/surveying" },
    { label: "Logjistikë", href: "/logistics" },
    { label: "Rreth Nesh", href: "/about" },
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <div className="py-2">
              <div className="text-sm font-medium text-muted-foreground mb-2">Tema</div>
              <ThemeToggle />
            </div>
            <hr className="my-2 border-border" />
            <Link to="/auth" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full">
                Kyçu
              </Button>
            </Link>
            <Link to="/auth?tab=register" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full">
                Regjistrohu
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
