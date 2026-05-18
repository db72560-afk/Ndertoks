import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl hero-gradient p-10 text-center md:p-16">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Gati për të rritur biznesin tuaj?
          </h2>
          <p className="mb-8 text-primary-foreground/70">
            Regjistrohuni falas dhe filloni të listoni shërbimet ose produktet tuaja sot.
          </p>
          <Link to="/auth?tab=register">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              Krijo Llogarinë Falas <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
