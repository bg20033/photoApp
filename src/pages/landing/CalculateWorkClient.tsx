import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SentIcon,
  LocationIcon,
  Navigation03Icon,
} from "@hugeicons/core-free-icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import {
  type PricingPeriod,
  type TravelRule,
  type PricingPlan,
  type Service,
  type TeamTier,
  type Location,
  calculateMultiplier,
  DEFAULT_PRICING_PERIODS,
  DEFAULT_TRAVEL_RULE,
  DEFAULT_PLANS,
  DEFAULT_SERVICES,
  DEFAULT_TEAM_TIERS,
} from "@/lib/pricing";

export type {
  PricingPeriod,
  TravelRule,
  PricingPlan,
  Service,
  TeamTier,
  Location,
};

// ============================================
// MAP CONFIGURATION & HELPERS
// ============================================

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

const PRISTINA_CENTER: [number, number] = [42.6629, 21.1655];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
  border: "1px solid #eee",
};

function MapClickHandler({ onClick }: { onClick: (e: any) => void }) {
  useMapEvents({ click: onClick });
  return null;
}

function RecenterMap({
  center,
  zoom = 12,
}: {
  center: [number, number];
  zoom?: number;
}) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

// ============================================
// CLIENT QUOTE CALCULATOR
// ============================================

interface QuoteCalculatorProps {
  pricingPeriods?: PricingPeriod[];
  travelRule?: TravelRule;
  plans?: PricingPlan[];
  services?: Service[];
  teamTiers?: TeamTier[];
  locations?: Location[];
}

export default function CalculateWorkClient({
  pricingPeriods = DEFAULT_PRICING_PERIODS,
  travelRule = DEFAULT_TRAVEL_RULE,
  plans = DEFAULT_PLANS,
  services = DEFAULT_SERVICES,
  teamTiers = DEFAULT_TEAM_TIERS,
}: QuoteCalculatorProps) {
  // --- Date State ---
  const [weddingDate, setWeddingDate] = useState("");

  // --- Plan & Services State ---
  const [isCustomPlan, setIsCustomPlan] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null); // No plan selected initially
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState(teamTiers[0]?.teamSize || 1);

  // --- Location & Map State ---
  const [mapKey, setMapKey] = useState(Date.now());
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  const [searchAddress, setSearchAddress] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<
    { display_name: string; lat: string; lon: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // --- Modal State ---
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // ============================================
  // LOGIC & CALCULATIONS
  // ============================================

  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    [],
  );

  const distanceFromPristina = useMemo(() => {
    if (!selectedLocation) return 0;
    return calculateDistance(
      PRISTINA_CENTER[0],
      PRISTINA_CENTER[1],
      selectedLocation.lat,
      selectedLocation.lng,
    );
  }, [selectedLocation, calculateDistance]);

  const travelCost = useMemo(() => {
    if (!selectedLocation || !travelRule || distanceFromPristina === 0)
      return 0;

    const isInternational =
      selectedLocation.lat < 41.5 ||
      selectedLocation.lat > 43.5 ||
      selectedLocation.lng < 20 ||
      selectedLocation.lng > 23;

    const multiplier = isInternational
      ? travelRule.internationalMultiplier
      : travelRule.domesticMultiplier;
    return distanceFromPristina * travelRule.fuelCostPerKm * multiplier;
  }, [selectedLocation, distanceFromPristina, travelRule]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "WeddingQuoteCalculator/1.0",
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

  const onMapClick = useCallback(
    async (e: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = e.latlng;
      const address = await reverseGeocode(lat, lng);
      setSelectedLocation({ lat, lng, address });
      setSearchAddress(address);
    },
    [],
  );

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError("Geolocation is not supported by your browser");
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
        setSearchError("Unable to retrieve your location");
        setIsLocating(false);
      },
    );
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchAddress(value);
    setSearchError(null);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (value.length < 3) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=1&accept-language=en`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "WeddingQuoteCalculator/1.0",
          },
        },
      )
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setSearchSuggestions(data);
            setShowSuggestions(true);
            setSearchError(null);
          } else {
            setSearchSuggestions([]);
            setShowSuggestions(false);
            setSearchError("No results found");
          }
        })
        .catch(() => setSearchError("Search failed. Please try again."))
        .finally(() => setIsSearching(false));
    }, 500);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-suggestions") && !target.closest("input")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleSelectSuggestion = useCallback(
    (suggestion: { display_name: string; lat: string; lon: string }) => {
      const lat = parseFloat(suggestion.lat);
      const lng = parseFloat(suggestion.lon);
      const cityName =
        suggestion.display_name?.split(",")[0]?.trim() || "Selected Location";

      setSelectedLocation({ lat, lng, address: cityName });
      setSearchAddress(cityName);
      setShowSuggestions(false);
      setSearchSuggestions([]);
      setSearchError(null);
      setMapKey(Date.now());
    },
    [],
  );

  const handleSearch = useCallback(() => {
    if (!searchAddress || searchAddress.length < 3) {
      setSearchError("Please enter at least 3 characters");
      return;
    }
    handleSearchChange(searchAddress);
  }, [searchAddress, handleSearchChange]);

  const toggleService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName],
    );
  };

  // --- Cost Calculations ---
  const seasonalMultiplier = useMemo(() => {
    if (!weddingDate) return 1;
    const date = new Date(weddingDate);
    const period = pricingPeriods.find(
      (p) => date >= new Date(p.startDate) && date <= new Date(p.endDate),
    );
    return period ? calculateMultiplier(date, period) : 1;
  }, [weddingDate, pricingPeriods]);

  const teamPrice = useMemo(() => {
    if (!isCustomPlan) return 0;
    return teamTiers.find((t) => t.teamSize === teamSize)?.price || 0;
  }, [isCustomPlan, teamSize, teamTiers]);

  const addonsPrice = useMemo(() => {
    return selectedServices.reduce((total, serviceName) => {
      const service = services.find((s) => s.name === serviceName);
      return total + (service?.price || 0);
    }, 0);
  }, [selectedServices, services]);

  const basePrice = isCustomPlan ? teamPrice : selectedPlan?.basePrice || 0;
  const seasonalAdjustment = basePrice * (seasonalMultiplier - 1);
  const subtotal = basePrice + seasonalAdjustment + travelCost + addonsPrice;

  // Determine if we should show the bottom bar (if ANY data has been entered/selected)
  const hasSelectedData = Boolean(
    weddingDate ||
    selectedLocation ||
    selectedPlan ||
    isCustomPlan ||
    selectedServices.length > 0,
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto my-10 pb-24 relative p-4">
      <Card>
        <CardHeader>
          <CardTitle>Wedding Quote Calculator</CardTitle>
          <p className="text-sm text-muted-foreground">
            Get an instant quote for your wedding coverage
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* WEDDING DATE */}
          <div className="space-y-2 pr-4">
            <Label>Wedding Date</Label>
            <Input
              type="date"
              lang="en-GB"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
            />
            {seasonalMultiplier > 1 && (
              <Badge className="mt-1 bg-amber-100 text-amber-900 border-amber-200">
                Peak season pricing: {seasonalMultiplier}x
              </Badge>
            )}
          </div>

          {/* WEDDING LOCATION */}
          <div className="space-y-3">
            <Label>Wedding Location</Label>
            <div className="flex gap-2 relative z-50">
              <div className="flex-1">
                <Input
                  placeholder="Search for city or venue (min. 3 characters)"
                  value={searchAddress}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (searchSuggestions.length > 0) setShowSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchSuggestions.length > 0)
                      handleSelectSuggestion(searchSuggestions[0]);
                    else if (e.key === "Enter") handleSearch();
                  }}
                  className={searchError ? "border-red-500" : ""}
                />
                {searchError && (
                  <p className="text-xs text-red-500 mt-1">{searchError}</p>
                )}
              </div>

              <Button
                variant="outline"
                title="Use my current location"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
              >
                <HugeiconsIcon
                  icon={Navigation03Icon}
                  className={`size-4 ${isLocating ? "animate-pulse" : ""}`}
                />
              </Button>
              <Button
                variant="secondary"
                onClick={handleSearch}
                disabled={isSearching || searchAddress.length < 3}
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>

              {/* Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions absolute top-full left-0 right-0 z-50 bg-background border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-3 py-2 hover:bg-muted text-sm border-b last:border-b-0 transition-colors"
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="font-medium truncate">
                        {suggestion.display_name?.split(",")[0]}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {suggestion.display_name
                          ?.split(",")
                          .slice(1, 4)
                          .join(",")}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border shadow-sm relative z-0">
              <MapContainer
                key={mapKey}
                center={
                  selectedLocation
                    ? [selectedLocation.lat, selectedLocation.lng]
                    : PRISTINA_CENTER
                }
                zoom={selectedLocation ? 12 : 8}
                style={mapContainerStyle}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={PRISTINA_CENTER}
                  icon={createCustomIcon(true)}
                >
                  <Popup>
                    <div className="text-center font-semibold text-sm">
                      Base: Pristina
                    </div>
                  </Popup>
                </Marker>

                {selectedLocation && (
                  <Marker
                    position={[selectedLocation.lat, selectedLocation.lng]}
                    icon={createCustomIcon(false)}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>{selectedLocation.address}</strong>
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {distanceFromPristina.toFixed(1)} km from Base
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                )}
                <MapClickHandler onClick={onMapClick} />
                {selectedLocation && (
                  <RecenterMap
                    center={[selectedLocation.lat, selectedLocation.lng]}
                    zoom={11}
                  />
                )}
              </MapContainer>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              👆 Click anywhere on the map to accurately pin your wedding
              location
            </p>

            {/* Selected Location Banner */}
            {selectedLocation && (
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border">
                <div className="flex items-center gap-3">
                  <HugeiconsIcon
                    icon={LocationIcon}
                    className="size-5 text-primary"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {selectedLocation.address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {distanceFromPristina.toFixed(1)} km from Pristina base
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedLocation(null);
                    setSearchAddress("");
                    setSearchError(null);
                    setMapKey(Date.now());
                  }}
                >
                  Clear Pin
                </Button>
              </div>
            )}

            {travelCost > 0 && selectedLocation && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-900 border-amber-200"
              >
                Estimated Travel Cost: €{travelCost.toFixed(2)}
              </Badge>
            )}
          </div>

          {/* PLAN SELECTION */}
          <div className="space-y-3">
            <Label>Coverage Plan</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Custom Plan Option */}
              <div
                className={`border rounded-lg p-4 transition-all ${
                  isCustomPlan
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "hover:border-primary/50"
                }`}
              >
                <label className="flex items-start cursor-pointer w-full">
                  <input
                    type="radio"
                    name="planType"
                    checked={isCustomPlan}
                    onChange={() => {
                      setIsCustomPlan(true);
                      setSelectedPlan(null);
                    }}
                    className="mr-3 mt-1 accent-primary"
                  />
                  <div className="flex-1">
                    <span className="font-semibold block mb-1">
                      Custom Team Size
                    </span>
                    <p className="text-xs text-muted-foreground mb-3">
                      Build your own package by selecting team size and add-ons.
                    </p>
                  </div>
                </label>

                {/* Extracted Dropdown to prevent label click interception */}
                <div className="pl-7 mt-2">
                  <Label className="text-xs mb-1 block">Team Size Setup</Label>
                  <select
                    className="w-full p-2 text-sm border rounded-md disabled:opacity-50 disabled:bg-muted"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                    disabled={!isCustomPlan}
                  >
                    {teamTiers.map((tier) => (
                      <option key={tier.id} value={tier.teamSize}>
                        {tier.teamSize}{" "}
                        {tier.teamSize === 1 ? "Person" : "People"} - Base €
                        {tier.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Predefined Packages */}
              {plans.map((plan) => (
                <label
                  key={plan.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all flex flex-col justify-between ${
                    !isCustomPlan && selectedPlan?.id === plan.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      name="planType"
                      checked={!isCustomPlan && selectedPlan?.id === plan.id}
                      onChange={() => {
                        setIsCustomPlan(false);
                        setSelectedPlan(plan);
                      }}
                      className="mr-3 mt-1 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold block">{plan.name}</span>
                        <span className="font-bold text-primary">
                          €{plan.basePrice}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 mb-2">
                        {plan.description}
                      </p>
                      <p className="text-xs font-medium mb-2">
                        Includes a {plan.includedTeamSize}-person team.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-auto pl-7">
                    {plan.includedServices.slice(0, 4).map((s, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        {s}
                      </Badge>
                    ))}
                    {plan.includedServices.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        +{plan.includedServices.length - 4} more
                      </Badge>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ADDITIONAL SERVICES */}
          <div className="space-y-3 pt-4 border-t">
            <Label>Additional Services & Add-ons</Label>
            <div className="grid sm:grid-cols-2 gap-2 border rounded-md p-3 max-h-75 overflow-y-auto bg-muted/20">
              {services.map((service) => {
                const isIncluded =
                  !isCustomPlan &&
                  selectedPlan?.includedServices.includes(service.name);
                const isSelected = selectedServices.includes(service.name);

                return (
                  <label
                    key={service.id}
                    className={`flex items-center justify-between p-3 rounded border bg-background transition-colors ${
                      isIncluded
                        ? "opacity-60 cursor-not-allowed border-dashed"
                        : "cursor-pointer hover:border-primary/50"
                    } ${isSelected ? "border-primary shadow-sm" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected || isIncluded || false}
                        onChange={() => {
                          if (!isIncluded) toggleService(service.name);
                        }}
                        disabled={isIncluded}
                        className="accent-primary size-4"
                      />
                      <span className="text-sm font-medium">
                        {service.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {isIncluded ? (
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          Included
                        </span>
                      ) : (
                        `€${service.price}`
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CONDITIONAL BOTTOM BAR */}
      {hasSelectedData && (
        <div className="fixed bottom-0  left-2 right-2 bg-linear-to-t from-background via-background/98 to-background/95 border-t border-x mx-auto rounded-t-2xl max-w-5xl backdrop-blur-sm p-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {weddingDate
                    ? new Date(weddingDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date Pending"}
                </span>
                <span className="text-sm font-semibold truncate max-w-37.5">
                  {selectedLocation?.address || "Location Pending"}
                </span>
              </div>

              {addonsPrice > 0 && (
                <>
                  <div className="h-10 w-px bg-border" />
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      Add-ons
                    </span>
                    <span className="text-sm font-semibold">
                      {selectedServices.length} selected
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-6 ">
              <div className="flex flex-col items-end">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Total Estimate
                </span>
                <span className="text-3xl font-black text-gray-900">
                  €
                  {subtotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <Button
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all"
                onClick={() => setShowEmailModal(true)}
                disabled={
                  !weddingDate ||
                  !selectedLocation ||
                  (!isCustomPlan && !selectedPlan)
                }
              >
                <HugeiconsIcon icon={SentIcon} className="size-5 mr-2" />
                Send Quote
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Receive Quote via Email"
      >
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Enter your details to receive a formal copy of this estimate. We'll
            also follow up to answer any questions.
          </p>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="E.g. Jane Doe"
              value={emailForm.name}
              onChange={(e) =>
                setEmailForm({ ...emailForm, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={emailForm.email}
              onChange={(e) =>
                setEmailForm({ ...emailForm, email: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+383 44 123 456"
              value={emailForm.phone}
              onChange={(e) =>
                setEmailForm({ ...emailForm, phone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any additional questions or details..."
              value={emailForm.message}
              onChange={(e) =>
                setEmailForm({ ...emailForm, message: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="pt-4">
            <Button
              className="w-full"
              disabled={!emailForm.name || !emailForm.email}
              onClick={() => {
                alert(`Mock: Quote sent to ${emailForm.email}!`);
                setShowEmailModal(false);
              }}
            >
              Send to Email
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
