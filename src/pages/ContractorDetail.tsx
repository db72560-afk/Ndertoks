import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Star, Briefcase, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Contractor {
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

const ContractorDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const data = await apiClient.get(`/api/listings/${id}`);
        setContractor(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load contractor",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContractor();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Kontraktori nuk u gjet
          </h1>
          <Link to="/contractors">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kthehu
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Create WhatsApp link with WhatsApp number and pre-filled message
  const whatsappNumber = "38349714421"; // +383 49 714 421
  const whatsappMsg = encodeURIComponent(
    `Përshëndetje! Jam i interesuar për shërbimet e ${contractor.title} - ${contractor.specialty}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  const handleWhatsAppClick = async () => {
    if (whatsappUrl) {
      // Track the inquiry
      try {
        await apiClient.patch(`/api/listings/${id}/inquiries`, {});
      } catch (error) {
        console.error("Failed to track inquiry");
      }
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <Link
          to="/contractors"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kthehu te Kontraktorët
        </Link>
        <div className="mt-4 grid gap-8 lg:grid-cols-2">
          <img
            src={contractor.image}
            alt={contractor.title}
            className="h-80 w-full rounded-lg object-cover lg:h-[450px]"
          />
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="mb-3 w-fit">
              {contractor.specialty}
            </Badge>
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              {contractor.title}
            </h1>
            <div className="mb-4 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-5 w-5" /> {contractor.location}
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium text-foreground">
                {contractor.userId.companyName || contractor.userId.fullName}
              </p>
            </div>
            <div className="mb-6 flex items-center gap-6">
              {contractor.rating && (
                <span className="flex items-center gap-1 text-accent">
                  <Star className="h-5 w-5 fill-current" /> {contractor.rating} /
                  5.0
                </span>
              )}
              {contractor.projects !== undefined && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Briefcase className="h-5 w-5" /> {contractor.projects} projects
                </span>
              )}
            </div>
            <div className="mb-8 rounded-lg border bg-muted/50 p-6">
              <p className="text-sm text-muted-foreground">Specializimi</p>
              <p className="text-2xl font-bold text-foreground">
                {contractor.specialty}
              </p>
              {contractor.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {contractor.description}
                </p>
              )}
            </div>

            <Button
              size="lg"
              className="w-full gap-2 bg-[#25D366] hover:bg-[#1da851] text-white"
              onClick={handleWhatsAppClick}
              disabled={!whatsappUrl}
            >
              <MessageCircle className="h-5 w-5" /> Kontakto në WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            handleWhatsAppClick();
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-[#25D366] text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-transform cursor-pointer">
            <MessageCircle className="h-6 w-6" />
          </div>
        </a>
      )}

      <Footer />
    </div>
  );
};

export default ContractorDetail;
