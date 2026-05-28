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
import { ArrowLeft, Upload, X } from "lucide-react";

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
    buildingCompensation: "",
    // Contractor
    specialty: "",
    rating: "",
    projects: "",
    // Material
    category: "",
    supplier: "",
    unit: "",
  });

  const [priceOptions, setPriceOptions] = useState<Array<{
    cashAmount?: number;
    compensationPercentage?: number;
    description?: string;
  }>>([]);

  const [newPriceOption, setNewPriceOption] = useState({
    cashAmount: "",
    compensationPercentage: "",
    description: "",
  });

  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

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
            buildingCompensation: listing.buildingCompensation || "",
            specialty: listing.specialty || "",
            rating: listing.rating || "",
            projects: listing.projects || "",
            category: listing.category || "",
            supplier: listing.supplier || "",
            unit: listing.unit || "",
          });
          if (listing.priceOptions && listing.priceOptions.length > 0) {
            setPriceOptions(listing.priceOptions);
          }
          if (listing.image) {
            setImagePreview(listing.image);
          }
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

  const addPriceOption = () => {
    if (!newPriceOption.cashAmount && !newPriceOption.compensationPercentage) {
      toast({
        title: "Error",
        description: "Plejtë krijoni opcionin e çmimit",
        variant: "destructive",
      });
      return;
    }

    const option: typeof priceOptions[0] = {};
    if (newPriceOption.cashAmount !== "") {
      option.cashAmount = parseFloat(newPriceOption.cashAmount);
    }
    if (newPriceOption.compensationPercentage !== "") {
      option.compensationPercentage = parseFloat(newPriceOption.compensationPercentage);
    }

    // Auto-generate description if not provided
    if (!newPriceOption.description) {
      const parts = [];
      if (option.cashAmount !== undefined) parts.push(`€${option.cashAmount.toLocaleString()}`);
      if (option.compensationPercentage !== undefined) parts.push(`${option.compensationPercentage}% kompenzim`);
      option.description = parts.join(" + ");
    } else {
      option.description = newPriceOption.description;
    }

    setPriceOptions([...priceOptions, option]);
    setNewPriceOption({ cashAmount: "", compensationPercentage: "", description: "" });
    toast({
      title: "Success",
      description: `Opsion çmimi shtuar: ${option.description}`,
    });
  };

  const removePriceOption = (index: number) => {
    setPriceOptions(priceOptions.filter((_, i) => i !== index));
  };

  const handleFileToBase64 = (file: File) => {
    // Check file size - max 10MB
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      toast({
        title: "Error",
        description: `Skedari është shumë i madh. Maksimumi: 10MB, Tuaji: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        image: base64String,
      }));
      setImagePreview(base64String);
      toast({
        title: "Success",
        description: "Imazhi u ngarkua me sukses",
      });
    };
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Dështim në leximin e skedarit",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleFileToBase64(file);
      } else {
        toast({
          title: "Error",
          description: "Ju lutem zgjidhni një imazh",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      handleFileToBase64(files[0]);
    }
  };

  const clearImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For Parcels with priceOptions, price is optional
      const hasParcelPriceOptions = listingType === "Parcel" && priceOptions.length > 0;
      const priceValue = formData.price ? parseFloat(formData.price) : (hasParcelPriceOptions ? 0 : 1);

      const data = {
        type: listingType,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: priceValue,
        image: formData.image,
        ...(listingType === "Parcel" && {
          area: parseFloat(formData.area),
          parcelType: formData.parcelType,
          buildingCompensation: formData.buildingCompensation ? parseFloat(formData.buildingCompensation) : undefined,
          priceOptions: priceOptions.length > 0 ? priceOptions : undefined,
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
                <Label htmlFor="price">Price {listingType !== "Parcel" && "*"} {listingType === "Parcel" && "(opsional nëse shtoni Opcione Çmimi)"}</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required={listingType !== "Parcel"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Imazhi</Label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      onClick={clearImage}
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Drag & Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    dragActive
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer block">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium text-foreground">Zvarrni imazhin këtu</p>
                    <p className="text-xs text-muted-foreground mt-1">ose klikoni për të zgjedhur (Max: 10MB)</p>
                  </label>
                </div>

                {/* URL Fallback */}
                <div className="mt-3">
                  <Label className="text-xs text-muted-foreground">ose vendosni URL të imazhit</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.image && !formData.image.startsWith("data:") ? formData.image : ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }));
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="text-xs mt-1"
                  />
                </div>
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

                  <div className="space-y-2">
                    <Label htmlFor="buildingCompensation">Building Compensation (%)</Label>
                    <Input
                      id="buildingCompensation"
                      name="buildingCompensation"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.buildingCompensation}
                      onChange={handleChange}
                      placeholder="e.g., 30"
                    />
                  </div>

                  {/* Price Options */}
                  <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                    <h3 className="font-semibold text-foreground">Opcione Çmimi</h3>
                    
                    {/* Price Option Input */}
                    <div className="space-y-3 border-b pb-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="cashAmount" className="text-xs">Cash (€)</Label>
                          <Input
                            id="cashAmount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={newPriceOption.cashAmount}
                            onChange={(e) => setNewPriceOption({...newPriceOption, cashAmount: e.target.value})}
                            placeholder="p.sh. 10000"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="compensationPercentage" className="text-xs">Kompenzim (%)</Label>
                          <Input
                            id="compensationPercentage"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={newPriceOption.compensationPercentage}
                            onChange={(e) => setNewPriceOption({...newPriceOption, compensationPercentage: e.target.value})}
                            placeholder="p.sh. 40"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="description" className="text-xs">Përshkrim (opsional)</Label>
                        <Input
                          id="description"
                          type="text"
                          value={newPriceOption.description}
                          onChange={(e) => setNewPriceOption({...newPriceOption, description: e.target.value})}
                          placeholder="p.sh. €5,000 cash + 30% kompenzim"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={addPriceOption}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        + Shto Opsion
                      </Button>
                    </div>

                    {/* Price Options List */}
                    {priceOptions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">Opsionet e Shtuara:</p>
                        {priceOptions.map((option, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-background p-2 rounded border text-sm">
                            <span>{option.description}</span>
                            <Button
                              type="button"
                              onClick={() => removePriceOption(idx)}
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs"
                            >
                              Hiq
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
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
