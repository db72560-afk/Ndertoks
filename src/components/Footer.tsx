import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">NdërtoKS</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Platforma B2B për industrinë e ndërtimit në Kosovë.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Platforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/parcels" className="hover:text-foreground transition-colors">Parcela</Link></li>
              <li><Link to="/contractors" className="hover:text-foreground transition-colors">Kontraktorë</Link></li>
              <li><Link to="/materials" className="hover:text-foreground transition-colors">Materiale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Kompania</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">Rreth Nesh</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Kontakti</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Kushtet</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Kontakti</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>info@ndertoks.com</li>
              <li>+383 44 000 000</li>
              <li>Prishtinë, Kosovë</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} NdërtoKS. Të gjitha të drejtat e rezervuara.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
