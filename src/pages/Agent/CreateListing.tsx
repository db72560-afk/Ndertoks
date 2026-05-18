import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

type ListingType = "Parcel" | "Contractor" | "Material" | "Architect" | "Surveyor" | "Logistics";

const CreateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();

  const [listingType, setListingType] = useState<ListingType>("Parcel");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    image: "",
    // Parcel
    area: "",
    parcelType: "Industriale" as const,
    // Contractor
    specialty: "",
    rating: "",
    projects: "",
    // Material
    category: "",
    supplier: "",
    unit: "",
  });

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        try {
          const listing = await apiClient.get(`/api/listings/${id}`, token!);
          setListingType(listing.type);
          setFormData({
            title: listing.title || "",
            description: listing.description || "",
            location: listing.location || "",
            price: listing.price || "",
            image: listing.image || "",
            area: listing.area || "",
            parcelType: listing.parcelType || "Industriale",
            specialty: listing.specialty || "",
            rating: listing.rating || "",
            projects: listing.projects || "",
            category: listing.category || "",
            supplier: listing.supplier || "",
            unit: listing.unit || "",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load listing",
            variant: "destructive",
          });
        }
      };
      fetchListing();
    }
  }, [id, token, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        type: listingType,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price),
        image: formData.image,
        ...(listingType === "Parcel" && {
          area: parseFloat(formData.area),
          parcelType: formData.parcelType,
        }),
        ...(listingType === "Contractor" && {
          specialty: formData.specialty,
          rating: formData.rating ? parseFloat(formData.rating) : undefined,
          projects: formData.projects ? parseInt(formData.projects) : undefined,
        }),
        ...(listingType === "Material" && {
          category: formData.category,
          supplier: formData.supplier,
          unit: formData.unit,
        }),
        ...(listingType === "Architect" && {
          specialty: formData.specialty,
          rating: formData.rating ? parseFloat(formData.rating) : undefined,
          projects: formData.projects ? parseInt(formData.projects) : undefined,
        }),
        ...(listingType === "Surveyor" && {
          specialty: formData.specialty,
          rating: formData.rating ? parseFloat(formData.rating) : undefined,
          projects: formData.projects ? parseInt(formData.projects) : undefined,
        }),
        ...(listingType === "Logistics" && {
          specialty: formData.specialty,
          rating: formData.rating ? parseFloat(formData.rating) : undefined,
          projects: formData.projects ? parseInt(formData.projects) : undefined,
        }),
      };

      if (id) {
        await apiClient.patch(`/api/listings/${id}`, data, token!);
        toast({
          title: "Success",
          description: "Listing updated",
        });
      } else {
        await apiClient.post("/api/listings", data, token!);
        toast({
          title: "Success",
          description: "Listing created",
        });
      }

      navigate("/agent/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/agent/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>
              {id ? "Edit Listing" : "Create New Listing"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Listing Type */}
              {!id && (
                <div className="space-y-2">
                  <Label htmlFor="listingType">Listing Type</Label>
                  <Select value={listingType} onValueChange={(value) => setListingType(value as ListingType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Parcel">Parcel (Land)</SelectItem>
                      <SelectItem value="Contractor">Contractor (Services)</SelectItem>
                      <SelectItem value="Material">Material (Supplies)</SelectItem>
                      <SelectItem value="Architect">Architect &amp; Design</SelectItem>
                      <SelectItem value="Surveyor">Surveying Services</SelectItem>
                      <SelectItem value="Logistics">Logistics Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Common Fields */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Listing title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your listing"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City or area"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Parcel Specific */}
              {listingType === "Parcel" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (m²) *</Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      step="0.01"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="5000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parcelType">Parcel Type *</Label>
                    <Select value={formData.parcelType} onValueChange={(value) => handleSelectChange("parcelType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Industriale">Industrial</SelectItem>
                        <SelectItem value="Rezidenciale">Residential</SelectItem>
                        <SelectItem value="Komerciale">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Contractor Specific */}
              {listingType === "Contractor" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="e.g., Construction, Electrical"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="4.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projects">Number of Projects</Label>
                    <Input
                      id="projects"
                      name="projects"
                      type="number"
                      value={formData.projects}
                      onChange={handleChange}
                      placeholder="45"
                    />
                  </div>
                </>
              )}

              {/* Material Specific */}
              {listingType === "Material" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g., Cement, Bricks"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier *</Label>
                    <Input
                      id="supplier"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      placeholder="Supplier name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Input
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      placeholder="kg, piece, m³"
                      required
                    />
                  </div>
                </>
              )}

              {/* Architect Specific */}
              {listingType === "Architect" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="e.g., Residential, Commercial"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="4.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projects">Number of Projects</Label>
                    <Input
                      id="projects"
                      name="projects"
                      type="number"
                      value={formData.projects}
                      onChange={handleChange}
                      placeholder="25"
                    />
                  </div>
                </>
              )}

              {/* Surveyor Specific */}
              {listingType === "Surveyor" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="e.g., Land Surveying, GPS Mapping"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="4.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projects">Number of Projects</Label>
                    <Input
                      id="projects"
                      name="projects"
                      type="number"
                      value={formData.projects}
                      onChange={handleChange}
                      placeholder="15"
                    />
                  </div>
                </>
              )}

              {/* Logistics Specific */}
              {listingType === "Logistics" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      placeholder="e.g., Transport, Warehousing"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0-5)</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="4.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projects">Number of Projects</Label>
                    <Input
                      id="projects"
                      name="projects"
                      type="number"
                      value={formData.projects}
                      onChange={handleChange}
                      placeholder="50"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading
                    ? "Saving..."
                    : id
                    ? "Update Listing"
                    : "Create Listing"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/agent/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default CreateListing;
