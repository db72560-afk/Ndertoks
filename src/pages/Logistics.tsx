import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiClient } from "@/lib/api";
import { MapPin, Star, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LogisticsCompany {
  _id: string;
  title: string;
  image?: string;
  location: string;
  specialty?: string;
  rating?: number;
  projects?: number;
  price: number;
}

const Logistics = () => {
  const [companies, setCompanies] = useState<LogisticsCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/listings", null, { type: "Logistics" });
        setCompanies(response.listings || []);
      } catch (err) {
        console.error("Error fetching logistics companies:", err);
        setError("Failed to load logistics companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Po ngarkohen kompanit e logjistikës...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Logjistikë</h1>
        <p className="mb-8 text-muted-foreground">Gjeni kompani të besuara për transportin dhe logjistikën e ndërtimit</p>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {companies.length === 0 ? (
          <p className="text-muted-foreground">Nuk ka kompani logjistike të disponueshëm</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((c) => (
              <Link key={c._id} to={`/logistics/${c._id}`}>
                <Card className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer">
                  <img src={c.image} alt={c.title} className="h-48 w-full object-cover" />
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-2">{c.specialty || "Logjistikë"}</Badge>
                    <h3 className="mb-1 text-lg font-semibold text-foreground">{c.title}</h3>
                    <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {c.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-accent">
                        <Star className="h-4 w-4 fill-current" /> {c.rating || 0}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" /> {c.projects || 0} projekte
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Logistics;
