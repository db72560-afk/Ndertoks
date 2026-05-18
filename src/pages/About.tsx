import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Users, ShieldCheck, Globe } from "lucide-react";

const values = [
  { icon: Building2, title: "Cilësi", desc: "Lidhim bizneset me kontraktorë dhe furnizues të verifikuar." },
  { icon: Users, title: "Bashkëpunim", desc: "Platforma jonë mundëson bashkëpunim të lehtë mes kompanive." },
  { icon: ShieldCheck, title: "Besueshmëri", desc: "Të gjithë partnerët kalojnë procesin e verifikimit." },
  { icon: Globe, title: "Lokale", desc: "E ndërtuar për tregun e Kosovës, me fokus në nevojat lokale." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground">Rreth NdërtoKS</h1>
          <p className="mb-12 text-lg text-muted-foreground">
            NdërtoKS është platforma B2B që lidh bizneset e ndërtimit në Kosovë. Ne e bëjmë më të lehtë gjetjen e tokës, kontraktorëve dhe materialeve për projektet tuaja.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
