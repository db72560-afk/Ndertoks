import { MapPin, HardHat, Package, Truck, Ruler, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    icon: MapPin,
    title: "Parcela Toke",
    description: "Gjeni parcela për ndërtim në të gjitha komunat e Kosovës",
    count: "240+ lista",
  },
  {
    icon: HardHat,
    title: "Kontraktorë",
    description: "Kontraktorë të licencuar për çdo lloj projekti ndërtimi",
    count: "180+ biznese",
  },
  {
    icon: Package,
    title: "Materiale Ndërtimi",
    description: "Çimento, hekur, tulla, izolim dhe më shumë",
    count: "500+ produkte",
  },
  {
    icon: Truck,
    title: "Transport & Logjistikë",
    description: "Shërbime transporti për materialet e ndërtimit",
    count: "60+ kompani",
  },
  {
    icon: Ruler,
    title: "Arkitekturë & Projektim",
    description: "Studio arkitekture dhe inxhinieri të licencuara",
    count: "90+ studio",
  },
  {
    icon: ShieldCheck,
    title: "Inspektim & Certifikim",
    description: "Shërbime inspektimi dhe kontrolli të cilësisë",
    count: "35+ kompani",
  },
];

const Categories = () => {
  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Të gjitha Kategorite
          </h2>
          <p className="text-muted-foreground">
            Shfletoni të gjitha shërbimet dhe produktet për ndërtim
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((cat) => (
            <Card
              key={cat.title}
              className="group cursor-pointer card-hover border-0 bg-card hover:shadow-md"
            >
              <CardContent className="p-4 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <cat.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm text-card-foreground mb-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {cat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
