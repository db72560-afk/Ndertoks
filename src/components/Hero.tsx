import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-construction.jpg";

const Hero = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Construction site in Kosovo"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/70 to-secondary/60" />
      </div>

      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Ndërtoni më mirë, më shpejt, më lirë
            </h1>
            <p className="text-lg text-white/90">
              Platforma B2B e ndërtimit. Gjeni parcela, kontraktorë, materiale dhe shërbime profesionale.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-lg shadow-lg p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Kërko parcela, kontraktorë, materiale..."
                className="h-12 bg-transparent border-0 pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button size="lg" className="h-12 px-8 font-semibold rounded-md" onClick={handleSearch}>
              Kërko
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
