import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Maximize, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Parcel {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  area: number;
  parcelType: string;
  image: string;
  buildingCompensation?: number;
  priceOptions?: Array<{
    cashAmount?: number;
    compensationPercentage?: number;
    description?: string;
  }>;
  userId: {
    fullName: string;
    companyName: string;
    whatsappNumber: string;
    email: string;
  };
}

const ParcelDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const data = await apiClient.get(`/api/listings/${id}`);
        setParcel(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load parcel",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchParcel();
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

  if (!parcel) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Parcela nuk u gjet</h1>
          <Link to="/parcels">
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
    `Përshëndetje! Jam i interesuar për: ${parcel.title} - ${parcel.location}`
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
          to="/parcels"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kthehu te Parcelat
        </Link>
        <div className="mt-4 grid gap-8 lg:grid-cols-2">
          <img
            src={parcel.image}
            alt={parcel.title}
            className="h-80 w-full rounded-lg object-cover lg:h-[450px]"
          />
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="mb-3 w-fit">
              {parcel.parcelType}
            </Badge>
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              {parcel.title}
            </h1>
            <div className="mb-4 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-5 w-5" /> {parcel.location}
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium text-foreground">
                {parcel.userId.companyName || parcel.userId.fullName}
              </p>
            </div>
            <div className="mb-6 flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Maximize className="h-5 w-5" />{" "}
                {parcel.area.toLocaleString()} m²
              </span>
            </div>
            {parcel.priceOptions && parcel.priceOptions.length > 0 ? (
              <div className="mb-8 space-y-3">
                <p className="text-sm font-semibold text-foreground">Opcione Çmimi Disponuese:</p>
                <div className="grid gap-3">
                  {parcel.priceOptions.map((option, idx) => (
                    <div key={idx} className="rounded-lg border-2 border-primary bg-primary/5 p-6">
                      <p className="text-xl font-bold text-primary">
                        {option.description}
                      </p>
                      {option.cashAmount !== undefined && option.compensationPercentage !== undefined && (
                        <p className="text-xs text-muted-foreground mt-2">
                          €{option.cashAmount.toLocaleString()} + {option.compensationPercentage}% kompenzim ndërtimi
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8 rounded-lg border bg-muted/50 p-6">
                <p className="text-sm text-muted-foreground">Çmimi</p>
                <p className="text-4xl font-bold text-primary">
                  €{parcel.price.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  €{(parcel.price / parcel.area).toFixed(2)} / m²
                </p>
              </div>
            )}
            {parcel.buildingCompensation !== undefined && parcel.buildingCompensation > 0 && !parcel.priceOptions && (
              <div className="mb-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-4">
                <p className="text-sm text-blue-600 dark:text-blue-300">Kompenzim Ndërtimi</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">
                  {parcel.buildingCompensation}%
                </p>
              </div>
            )}

            {parcel.description && (
              <div className="mb-8">
                <h3 className="font-semibold text-foreground mb-2">
                  Description
                </h3>
                <p className="text-muted-foreground">{parcel.description}</p>
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

export default ParcelDetail;
