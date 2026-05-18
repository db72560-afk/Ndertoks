import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiClient } from "@/lib/api";
import { MapPin, Maximize } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Parcel {
  _id: string;
  title: string;
  image?: string;
  location: string;
  area: number;
  price: number;
  parcelType?: string;
}

const Parcels = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const parcelTypes = ["Industriale", "Rezidenciale", "Komerciale"];

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/listings", null, { type: "Parcel" });
        setParcels(response.listings || []);
      } catch (err) {
        console.error("Error fetching parcels:", err);
        setError("Failed to load parcels");
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, []);

  const toggleParcelType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const filteredParcels = selectedTypes.length === 0
    ? parcels
    : parcels.filter((parcel) => selectedTypes.includes(parcel.parcelType || ""));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Po ngarkohen parcelat...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Parcela për Ndërtim</h1>
        <p className="mb-8 text-muted-foreground">Gjeni tokën ideale për projektin tuaj të ardhshëm</p>
        
        {/* Filter Section */}
        <div className="mb-8 flex flex-wrap gap-3">
          <span className="flex items-center text-sm font-medium text-foreground">Lloji i Parcelës:</span>
          {parcelTypes.map((type) => (
            <Button
              key={type}
              onClick={() => toggleParcelType(type)}
              variant={selectedTypes.includes(type) ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {type}
            </Button>
          ))}
        </div>

        {error && <p className="mb-4 text-red-500">{error}</p>}
        {filteredParcels.length === 0 ? (
          <p className="text-muted-foreground">Nuk ka parcela të disponueshme</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredParcels.map((parcel) => (
              <Link key={parcel._id} to={`/parcels/${parcel._id}`}>
                <Card className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer">
                  <img src={parcel.image} alt={parcel.title} className="h-48 w-full object-cover" />
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-2">{parcel.parcelType || "Parcela"}</Badge>
                    <h3 className="mb-1 text-lg font-semibold text-foreground">{parcel.title}</h3>
                    <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {parcel.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Maximize className="h-4 w-4" /> {parcel.area.toLocaleString()} m²
                      </span>
                      <span className="text-lg font-bold text-primary">€{parcel.price.toLocaleString()}</span>
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

export default Parcels;
