import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiClient } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Material {
  _id: string;
  title: string;
  image?: string;
  category?: string;
  supplier?: string;
  unit?: string;
  price: number;
}

const Materials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/listings", null, { type: "Material" });
        setMaterials(response.listings || []);
      } catch (err) {
        console.error("Error fetching materials:", err);
        setError("Failed to load materials");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Po ngarkohen materialet...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Materiale Ndërtimi</h1>
        <p className="mb-8 text-muted-foreground">Porositni materiale nga furnizuesit më të mirë në Kosovë</p>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {materials.length === 0 ? (
          <p className="text-muted-foreground">Nuk ka materiale të disponueshëm</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((m) => (
              <Link key={m._id} to={`/materials/${m._id}`}>
                <Card className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer">
                  <img src={m.image} alt={m.title} className="h-48 w-full object-cover" />
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-2">{m.category || "Materiale"}</Badge>
                    <h3 className="mb-1 text-lg font-semibold text-foreground">{m.title}</h3>
                    <p className="mb-2 text-sm text-muted-foreground">Furnizuesi: {m.supplier || "N/A"}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">€{m.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">/ {m.unit || "kg"}</span>
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

export default Materials;
