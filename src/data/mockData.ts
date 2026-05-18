export interface Parcel {
  id: string;
  title: string;
  location: string;
  area: number;
  price: number;
  type: string;
  image: string;
}

export interface Contractor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  projects: number;
  image: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  supplier: string;
  price: number;
  unit: string;
  image: string;
}

export const parcels: Parcel[] = [
  { id: "1", title: "Tokë 5000m² në Prishtinë", location: "Prishtinë, Zona Industriale", area: 5000, price: 150000, type: "Industriale", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400" },
  { id: "2", title: "Parcelë 800m² në Fushë Kosovë", location: "Fushë Kosovë, Qendër", area: 800, price: 45000, type: "Rezidenciale", image: "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=400" },
  { id: "3", title: "Tokë 2000m² në Ferizaj", location: "Ferizaj, Periferi", area: 2000, price: 80000, type: "Komerciale", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400" },
  { id: "4", title: "Parcelë 1200m² në Pejë", location: "Pejë, Lagja e Re", area: 1200, price: 55000, type: "Rezidenciale", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" },
  { id: "5", title: "Tokë 3500m² në Gjilan", location: "Gjilan, Zona e Biznesit", area: 3500, price: 120000, type: "Komerciale", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400" },
  { id: "6", title: "Parcelë 600m² në Mitrovicë", location: "Mitrovicë, Qendër", area: 600, price: 35000, type: "Rezidenciale", image: "https://images.unsplash.com/photo-1448630360428-65456659e233?w=400" },
];

export const contractors: Contractor[] = [
  { id: "1", name: "KosBuild sh.p.k.", specialty: "Ndërtim Rezidencial", location: "Prishtinë", rating: 4.8, projects: 45, image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400" },
  { id: "2", name: "AlbStruct", specialty: "Ndërtim Komercial", location: "Prizren", rating: 4.6, projects: 32, image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400" },
  { id: "3", name: "ProElektrik", specialty: "Instalime Elektrike", location: "Ferizaj", rating: 4.9, projects: 78, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400" },
  { id: "4", name: "HidroKos", specialty: "Instalime Hidraulike", location: "Pejë", rating: 4.7, projects: 56, image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400" },
  { id: "5", name: "MetalWorks KS", specialty: "Punime Metalike", location: "Mitrovicë", rating: 4.5, projects: 23, image: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400" },
  { id: "6", name: "GreenBuild", specialty: "Ndërtim Ekologjik", location: "Gjilan", rating: 4.8, projects: 18, image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400" },
];

export const materials: Material[] = [
  { id: "1", name: "Çimento Portland", category: "Çimento", supplier: "SharrCem", price: 5.50, unit: "kg", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400" },
  { id: "2", name: "Tulla e kuqe", category: "Tulla", supplier: "TullaKS", price: 0.35, unit: "copë", image: "https://images.unsplash.com/photo-1590767950092-42b8362368da?w=400" },
  { id: "3", name: "Hekur ndërtimi Ø12", category: "Hekur", supplier: "FerroKos", price: 0.85, unit: "kg", image: "https://images.unsplash.com/photo-1567789884554-0b844b597180?w=400" },
  { id: "4", name: "Gëlqere e bardhë", category: "Gëlqere", supplier: "LimeKS", price: 3.20, unit: "kg", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400" },
  { id: "5", name: "Beton i gatshëm C25/30", category: "Beton", supplier: "BetonMix", price: 75.00, unit: "m³", image: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=400" },
  { id: "6", name: "Izolim XPS 5cm", category: "Izolim", supplier: "IzoKos", price: 8.50, unit: "m²", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400" },
];

export type ListingType = "parcel" | "contractor" | "material";

export function searchAll(query: string) {
  const q = query.toLowerCase();
  return {
    parcels: parcels.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)),
    contractors: contractors.filter(c => c.name.toLowerCase().includes(q) || c.specialty.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)),
    materials: materials.filter(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.supplier.toLowerCase().includes(q)),
  };
}
