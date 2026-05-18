import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Star, Maximize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";

interface Listing {
  _id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  image?: string;
  area?: number;
  parcelType?: string;
  specialty?: string;
  rating?: number;
  projects?: number;
  category?: string;
  supplier?: string;
  unit?: string;
  views?: number;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/listings", null, { search: query, limit: 100 });
        setListings(response.listings || []);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search listings");
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      fetchResults();
    } else {
      setListings([]);
      setLoading(false);
    }
  }, [query]);

  const parcels = listings.filter((l) => l.type === "Parcel");
  const contractors = listings.filter((l) => l.type === "Contractor");
  const materials = listings.filter((l) => l.type === "Material");
  const total = listings.length;

  const getListingPath = (type: string) => {
    if (type === "Parcel") return "parcels";
    if (type === "Contractor") return "contractors";
    if (type === "Material") return "materials";
    return "parcels";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-1 text-3xl font-bold text-foreground">Rezultatet e kërkimit</h1>
        <p className="mb-8 text-muted-foreground">
          {loading ? "Po ngarkohen..." : total} rezultate për "<span className="font-medium text-foreground">{query}</span>"
        </p>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Po kërkohet...</p>
          </div>
        ) : total === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nuk u gjetën rezultate. Provoni me fjalë tjera.</p>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Të gjitha ({total})</TabsTrigger>
              <TabsTrigger value="parcels">Parcela ({parcels.length})</TabsTrigger>
              <TabsTrigger value="contractors">Kontraktorë ({contractors.length})</TabsTrigger>
              <TabsTrigger value="materials">Materiale ({materials.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((item) => (
                  <Link key={item._id} to={`/${getListingPath(item.type)}/${item._id}`}>
                    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                      {item.image && <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />}
                      <CardContent className="p-4">
                        <Badge variant="outline" className="mb-2">{item.type}</Badge>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {item.location}
                        </div>
                        <p className="mt-2 font-bold text-primary">€{item.price.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="parcels">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {parcels.length === 0 ? (
                  <p className="col-span-full text-center text-muted-foreground py-12">Nuk u gjetën parcela.</p>
                ) : (
                  parcels.map((p) => (
                    <Link key={p._id} to={`/parcels/${p._id}`}>
                      <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                        {p.image && <img src={p.image} alt={p.title} className="h-40 w-full object-cover" />}
                        <CardContent className="p-4">
                          <Badge variant="secondary" className="mb-2">{p.parcelType || "Parcelë"}</Badge>
                          <h3 className="font-semibold text-foreground">{p.title}</h3>
                          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {p.location}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Maximize className="h-3 w-3" /> {p.area?.toLocaleString()} m²
                            </span>
                            <span className="font-bold text-primary">€{p.price.toLocaleString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="contractors">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {contractors.length === 0 ? (
                  <p className="col-span-full text-center text-muted-foreground py-12">Nuk u gjetën kontraktorë.</p>
                ) : (
                  contractors.map((c) => (
                    <Link key={c._id} to={`/contractors/${c._id}`}>
                      <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                        {c.image && <img src={c.image} alt={c.title} className="h-40 w-full object-cover" />}
                        <CardContent className="p-4">
                          <Badge variant="secondary" className="mb-2">{c.specialty || "Kontraktor"}</Badge>
                          <h3 className="font-semibold text-foreground">{c.title}</h3>
                          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {c.location}
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-sm text-accent">
                            <Star className="h-3 w-3 fill-current" /> {c.rating || 0}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="materials">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {materials.length === 0 ? (
                  <p className="col-span-full text-center text-muted-foreground py-12">Nuk u gjetën materiale.</p>
                ) : (
                  materials.map((m) => (
                    <Link key={m._id} to={`/materials/${m._id}`}>
                      <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                        {m.image && <img src={m.image} alt={m.title} className="h-40 w-full object-cover" />}
                        <CardContent className="p-4">
                          <Badge variant="secondary" className="mb-2">{m.category || "Material"}</Badge>
                          <h3 className="font-semibold text-foreground">{m.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{m.supplier}</p>
                          <p className="mt-2 font-bold text-primary">€{m.price.toFixed(2)} / {m.unit || "kg"}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Search;
