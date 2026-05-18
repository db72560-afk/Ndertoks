import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Material {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  supplier: string;
  unit: string;
  image: string;
  userId: {
    fullName: string;
    companyName: string;
    whatsappNumber: string;
    email: string;
  };
}

const MaterialDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const data = await apiClient.get(`/api/listings/${id}`);
        setMaterial(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load material",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMaterial();
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

  if (!material) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Materiali nuk u gjet
          </h1>
          <Link to="/materials">
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
    `Përshëndetje! Jam i interesuar për: ${material.title} - Furnizuesi: ${material.supplier}`
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
          to="/materials"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kthehu te Materialet
        </Link>
        <div className="mt-4 grid gap-8 lg:grid-cols-2">
          <img
            src={material.image}
            alt={material.title}
            className="h-80 w-full rounded-lg object-cover lg:h-[450px]"
          />
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="mb-3 w-fit">
              {material.category}
            </Badge>
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              {material.title}
            </h1>
            <p className="mb-4 text-muted-foreground">
              Furnizuesi: {material.supplier}
            </p>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium text-foreground">
                {material.userId.companyName || material.userId.fullName}
              </p>
            </div>
            <div className="mb-8 rounded-lg border bg-muted/50 p-6">
              <p className="text-sm text-muted-foreground">Çmimi</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-primary">
                  €{material.price.toFixed(2)}
                </p>
                <span className="text-lg text-muted-foreground">
                  / {material.unit}
                </span>
              </div>
            </div>

            {material.description && (
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-2">
                  Description
                </h3>
                <p className="text-muted-foreground">{material.description}</p>
              </div>
            )}

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

export default MaterialDetail;
