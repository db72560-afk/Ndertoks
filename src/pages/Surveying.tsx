import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiClient } from "@/lib/api";
import { MapPin, Star, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Surveyor {
  _id: string;
  title: string;
  image?: string;
  location: string;
  specialty?: string;
  rating?: number;
  projects?: number;
  price: number;
}

const Surveying = () => {
  const [surveyors, setSurveyors] = useState<Surveyor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveyors = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/listings", null, { type: "Surveyor" });
        setSurveyors(response.listings || []);
      } catch (err) {
        console.error("Error fetching surveyors:", err);
        setError("Failed to load surveyors");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Po ngarkohen gjeodezistët...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Gjeodezi</h1>
        <p className="mb-8 text-muted-foreground">Gjeni gjeodezistë të besuar për matjen dhe planifikimin e parcelave</p>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {surveyors.length === 0 ? (
          <p className="text-muted-foreground">Nuk ka gjeodezistë të disponueshëm</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {surveyors.map((s) => (
              <Link key={s._id} to={`/surveying/${s._id}`}>
                <Card className="overflow-hidden transition-shadow hover:shadow-lg cursor-pointer">
                  <img src={s.image} alt={s.title} className="h-48 w-full object-cover" />
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-2">{s.specialty || "Gjeodezi"}</Badge>
                    <h3 className="mb-1 text-lg font-semibold text-foreground">{s.title}</h3>
                    <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {s.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-accent">
                        <Star className="h-4 w-4 fill-current" /> {s.rating || 0}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" /> {s.projects || 0} projekte
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

export default Surveying;
