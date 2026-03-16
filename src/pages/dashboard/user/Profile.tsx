import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Lock,
  Upload,
  Eye,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Palette,
  MapPin,
  Navigation,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { type Location } from "./CalculateWork/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BaseLocationCard } from "./CalculateWork/BaseLocation";

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createCustomIcon = (isBase: boolean = false) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${
      isBase ? "#3b82f6" : "#ef4444"
    }; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const DEFAULT_CENTER: [number, number] = [42.6629, 21.1655];

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.5rem",
  border: "1px solid #eee",
};

function MapClickHandler({ onClick }: { onClick: (e: any) => void }) {
  useMapEvents({ click: onClick });
  return null;
}

// Reverse geocode function
const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "PhotoApp/1.0",
        },
      },
    );
    if (!response.ok) throw new Error("Failed to fetch address");
    const data = await response.json();

    const addressParts = [];
    if (data.address?.city) addressParts.push(data.address.city);
    else if (data.address?.town) addressParts.push(data.address.town);
    else if (data.address?.village) addressParts.push(data.address.village);
    else if (data.address?.hamlet) addressParts.push(data.address.hamlet);

    if (data.address?.country) addressParts.push(data.address.country);

    return addressParts.length > 0
      ? addressParts.join(", ")
      : data.display_name?.split(",").slice(0, 2).join(",") ||
          `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

// Types
interface DashboardSettings {
  brand: {
    name: string;
    slogan: string;
    description: string;
    logoUrl: string;
  };
  user: {
    email: string;
    lastPasswordChange: string;
  };
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Initial state
const initialSettings: DashboardSettings = {
  brand: {
    name: "Acme Photography",
    slogan: "Capturing Life's Precious Moments",
    description:
      "Professional photography services for weddings, events, and portraits. We specialize in creating lasting memories that you'll cherish forever.",
    logoUrl: "",
  },
  user: {
    email: "user@example.com",
    lastPasswordChange: "2024-01-15",
  },
};

export default function ProfilePage() {
  const [settings, setSettings] = useState<DashboardSettings>(initialSettings);
  const [originalSettings, setOriginalSettings] =
    useState<DashboardSettings>(initialSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState("brand");

  // Password form state
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordForm>>(
    {},
  );
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Location state for map
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Create locations array for BaseLocationCard
  const locations: Location[] = useMemo(() => {
    if (!selectedLocation) return [];
    // Parse the address to extract city and country
    const addressParts = selectedLocation.address.split(", ");
    const city = addressParts[0] || selectedLocation.address;
    const country = addressParts[addressParts.length - 1] || "Unknown";

    return [
      {
        id: "base-location",
        name: selectedLocation.address,
        city,
        country,
        isBase: true,
      },
    ];
  }, [selectedLocation]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setIsDirty(hasChanges);
  }, [settings, originalSettings]);

  // Location handlers
  const onMapClick = async (e: { latlng: { lat: number; lng: number } }) => {
    const { lat, lng } = e.latlng;
    const address = await reverseGeocode(lat, lng);
    setSelectedLocation({ lat, lng, address });
    setSearchAddress(address);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const address = await reverseGeocode(lat, lng);
        setSelectedLocation({ lat, lng, address });
        setSearchAddress(address);
        setIsLocating(false);
      },
      () => {
        alert("Unable to retrieve your location");
        setIsLocating(false);
      },
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchAddress(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (value.length < 3) return;

    searchTimeoutRef.current = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1&accept-language=en`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "PhotoApp/1.0",
          },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const first = data[0];
            const lat = parseFloat(first.lat);
            const lng = parseFloat(first.lon);
            const cityName =
              first.display_name?.split(",")[0]?.trim() || "Selected Location";
            setSelectedLocation({ lat, lng, address: cityName });
          }
        })
        .catch(console.error);
    }, 500);
  };

  // Handlers
  const handleBrandChange = (
    field: keyof DashboardSettings["brand"],
    value: string,
  ) => {
    setSettings((prev) => ({
      ...prev,
      brand: { ...prev.brand, [field]: value },
    }));
  };

  const handleUserEmailChange = (email: string) => {
    setSettings((prev) => ({
      ...prev,
      user: { ...prev.user, email },
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleBrandChange("logoUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    handleBrandChange("logoUrl", "");
  };

  const validatePasswords = (): boolean => {
    const errors: Partial<PasswordForm> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(false);

    if (validatePasswords()) {
      // Simulate password change
      setTimeout(() => {
        setPasswordSuccess(true);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSettings((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            lastPasswordChange: new Date().toISOString().split("T")[0],
          },
        }));
      }, 1000);
    }
  };

  const handleSave = () => {
    setOriginalSettings(settings);
    setIsDirty(false);
    // Save brand settings to localStorage for use in Landing page
    localStorage.setItem("brandSettings", JSON.stringify(settings.brand));
    console.log("Saving settings:", settings);
  };

  const handleCancel = () => {
    setSettings(originalSettings);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Profile & Branding</h1>
        <p className="text-muted-foreground mt-1">
          Manage your brand identity and account security
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted p-1">
          <TabsTrigger
            value="brand"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Palette className="w-4 h-4" />
            Brand Configuration
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Lock className="w-4 h-4" />
            Account Security
          </TabsTrigger>
        </TabsList>

        {/* Brand Configuration Tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key="brand"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="brand" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label>Company Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {settings.brand.logoUrl ? (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-border">
                              <img
                                src={settings.brand.logoUrl}
                                alt="Logo preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={removeLogo}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 w-5 h-5 flex items-center justify-center"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/20">
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Logo
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 2MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={settings.brand.name}
                        onChange={(e) =>
                          handleBrandChange("name", e.target.value)
                        }
                        placeholder="Enter company name"
                      />
                    </div>

                    {/* Slogan */}
                    <div className="space-y-2">
                      <Label htmlFor="slogan">Slogan / Tagline</Label>
                      <Input
                        id="slogan"
                        value={settings.brand.slogan}
                        onChange={(e) =>
                          handleBrandChange("slogan", e.target.value)
                        }
                        placeholder="Enter your slogan"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={settings.brand.description}
                        onChange={(e) =>
                          handleBrandChange("description", e.target.value)
                        }
                        placeholder="Describe your business..."
                        rows={4}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {settings.brand.description.length}/500 characters
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-primary/10 via-background to-primary/5 p-6 min-h-100 flex flex-col items-center justify-center text-center border border-border/50">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                      <div className="relative z-10 space-y-4">
                        {settings.brand.logoUrl ? (
                          <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden shadow-lg">
                            <img
                              src={settings.brand.logoUrl}
                              alt="Logo"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-24 mx-auto rounded-xl bg-muted flex items-center justify-center">
                            <Building2 className="w-10 h-10 text-muted-foreground" />
                          </div>
                        )}

                        {/* Company Name Preview */}
                        <div>
                          <h3 className="text-2xl font-bold">
                            {settings.brand.name || "Company Name"}
                          </h3>
                        </div>

                        {/* Slogan Preview */}
                        {settings.brand.slogan && (
                          <p className="text-muted-foreground italic">
                            "{settings.brand.slogan}"
                          </p>
                        )}

                        {/* Description Preview */}
                        {settings.brand.description && (
                          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            {settings.brand.description.length > 100
                              ? settings.brand.description.slice(0, 100) + "..."
                              : settings.brand.description}
                          </p>
                        )}

                        {/* Mobile Preview Frame */}
                        <div className="mt-6 pt-4 border-t border-border/30">
                          <p className="text-xs text-muted-foreground">
                            Mobile Preview
                          </p>
                          <div className="w-32 h-56 mx-auto mt-2 rounded-xl border-4 border-gray-800 overflow-hidden bg-background">
                            <div className="p-2 text-center">
                              {settings.brand.logoUrl ? (
                                <img
                                  src={settings.brand.logoUrl}
                                  alt="Logo"
                                  className="w-8 h-8 mx-auto rounded object-cover"
                                />
                              ) : (
                                <Building2 className="w-8 h-8 mx-auto text-muted-foreground" />
                              )}
                              <p className="text-[6px] font-bold mt-1 truncate">
                                {settings.brand.name || "Company"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Your Base Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search for a location..."
                      value={searchAddress}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      variant="outline"
                      size="xl"
                      onClick={handleGetCurrentLocation}
                      disabled={isLocating}
                      title="Use my current location"
                    >
                      <Navigation
                        className={`h-8 w-8 ${isLocating ? "animate-pulse" : ""}`}
                      />
                    </Button>
                  </div>
                  <div className="rounded-lg overflow-hidden border shadow-sm">
                    <MapContainer
                      center={
                        selectedLocation
                          ? [selectedLocation.lat, selectedLocation.lng]
                          : DEFAULT_CENTER
                      }
                      zoom={selectedLocation ? 13 : 8}
                      style={mapContainerStyle}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapClickHandler onClick={onMapClick} />
                      {selectedLocation && (
                        <Marker
                          position={[
                            selectedLocation.lat,
                            selectedLocation.lng,
                          ]}
                          icon={createCustomIcon(false)}
                        >
                          <Popup>
                            <div className="text-sm">
                              <p className="font-medium">
                                {selectedLocation.address}
                              </p>
                            </div>
                          </Popup>
                        </Marker>
                      )}
                    </MapContainer>
                  </div>
                  {selectedLocation && (
                    <BaseLocationCard locations={locations} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>

        {/* Security Tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Section */}
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Email Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.user.email}
                        onChange={(e) => handleUserEmailChange(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Last password change: {settings.user.lastPasswordChange}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Password Change Section */}
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter current password"
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-xs text-destructive">
                            {passwordErrors.currentPassword}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter new password"
                        />
                        {passwordErrors.newPassword && (
                          <p className="text-xs text-destructive">
                            {passwordErrors.newPassword}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="Confirm new password"
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="text-xs text-destructive">
                            {passwordErrors.confirmPassword}
                          </p>
                        )}
                      </div>

                      {passwordSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Password changed successfully!
                        </motion.div>
                      )}

                      <Button type="submit" className="w-full gap-2">
                        <Lock className="w-4 h-4" />
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Security Info Card */}
              <Card className="glass-effect border-amber-200/50 bg-amber-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-amber-100">
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800">
                        Security Recommendations
                      </h4>
                      <ul className="mt-2 text-sm text-amber-700 space-y-1">
                        <li>• Use at least 8 characters in your password</li>
                        <li>
                          • Include uppercase, lowercase, numbers, and symbols
                        </li>
                        <li>• Don't reuse passwords from other accounts</li>
                        <li>
                          • Consider changing your password every 3-6 months
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Save Bar */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t p-4 z-50"
          >
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-50">
                  Unsaved Changes
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
