import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";

interface Listing {
  _id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  image?: string;
  views?: number;
  inquiries?: number;
  priceOptions?: Array<{
    cashAmount?: number;
    compensationPercentage?: number;
    description?: string;
  }>;
}

const FeaturedListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/listings", null, { limit: 4 });
        setListings(response.listings || []);
      } catch (err) {
        console.error("Error fetching featured listings:", err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const getListingPath = (type: string) => {
    if (type === "Parcel") return "parcels";
    if (type === "Contractor") return "contractors";
    if (type === "Material") return "materials";
    if (type === "Architect") return "architects";
    if (type === "Surveyor") return "surveying";
    if (type === "Logistics") return "logistics";
    return "parcels";
  };

  const getTypeLabel = (type: string) => {
    if (type === "Parcel") return "Parcelë";
    if (type === "Contractor") return "Kontraktor";
    if (type === "Material") return "Material";
    if (type === "Architect") return "Arkitektur";
    if (type === "Surveyor") return "Gjeodezi";
    if (type === "Logistics") return "Logjistikë";
    return type;
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-1">
              Ofertat më të reja
            </h2>
            <p className="text-muted-foreground text-sm">
              Shim i ofertave më të reja të disponueshme
            </p>
          </div>
          <Link to="/parcels" className="hidden md:inline">
            <Button variant="outline" size="sm">
              Shfaq të gjitha <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Po ngarkohet...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Nuk ka oferta të disponueshme</p>
            </div>
          ) : (
            listings.map((item) => (
              <Link
                key={item._id}
                to={`/${getListingPath(item.type)}/${item._id}`}
              >
                <Card className="group overflow-hidden border border-border bg-card hover:shadow-md transition-all card-hover h-full flex flex-col">
                  {/* Image container */}
                  <div className="relative h-40 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="h-8 w-8 text-primary/20 mx-auto mb-1" />
                          <span className="text-xs font-semibold text-primary/20">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur px-2 py-1 rounded text-xs font-medium text-primary">
                      {getTypeLabel(item.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col gap-1">
                        {item.priceOptions && item.priceOptions.length > 0 ? (
                          <div className="font-bold text-primary text-xs space-y-1">
                            {item.priceOptions.slice(0, 2).map((option, idx) => (
                              <div key={idx} className="text-xs">
                                {option.description}
                              </div>
                            ))}
                            {item.priceOptions.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{item.priceOptions.length - 2} më shumë
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="font-bold text-primary text-sm">
                            €{item.price ? item.price.toLocaleString() : "POD"}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        👁 {item.views || 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
