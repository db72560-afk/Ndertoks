import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Star, Briefcase, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Surveyor {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  specialty: string;
  rating?: number;
  projects?: number;
  image: string;
  userId: {
    fullName: string;
    companyName: string;
    whatsappNumber: string;
    email: string;
  };
}

const SurveyorDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [surveyor, setSurveyor] = useState<Surveyor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveyor = async () => {
      try {
        const data = await apiClient.get(`/api/listings/${id}`);
        setSurveyor(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load surveyor",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSurveyor();
  }, [id, toast]);

  const handleWhatsApp = async () => {
    try {
      await apiClient.patch(`/api/listings/${id}/inquiries`, {});
      const whatsappNumber = "38349714421"; // +383 49 714 421
      const message = encodeURIComponent(
        `Hi, I'm interested in your surveying service: ${surveyor?.title}`
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send inquiry",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Po ngarkohet...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!surveyor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <p className="text-muted-foreground">Gjeodezisti nuk u gjet.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/surveying" className="mb-6 flex items-center gap-2 text-accent hover:text-accent/80">
          <ArrowLeft className="h-4 w-4" /> Kthehu
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <img
              src={surveyor.image}
              alt={surveyor.title}
              className="h-96 w-full rounded-lg object-cover"
            />
          </div>

          <div>
            <Badge className="mb-4">{surveyor.specialty || "Gjeodezi"}</Badge>
            <h1 className="mb-2 text-4xl font-bold text-foreground">{surveyor.title}</h1>
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-1 text-lg">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span>{surveyor.rating || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-lg">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span>{surveyor.projects || 0} projekte</span>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-2 text-lg text-muted-foreground">
              <MapPin className="h-5 w-5" /> {surveyor.location}
            </div>

            <p className="mb-8 text-lg text-foreground">{surveyor.description}</p>

            <div className="mb-8 rounded-lg bg-muted p-6">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Çmimi</p>
              <p className="text-3xl font-bold text-primary">€{surveyor.price.toLocaleString()}</p>
            </div>

            <div className="mb-6 space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Kontakti</p>
              <p className="text-foreground">{surveyor.userId?.fullName}</p>
              <p className="text-foreground">{surveyor.userId?.companyName}</p>
            </div>

            <Button
              size="lg"
              className="w-full gap-2 bg-green-600 hover:bg-green-700"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-5 w-5" /> Kontakto në WhatsApp
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SurveyorDetail;
