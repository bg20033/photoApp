// ============================================
// SHARED PRICING TYPES
// ============================================

export interface PricingPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  peakDate: string;
  minMultiplier: number;
  maxMultiplier: number;
  curveWidth: number; // Standard deviation in days for bell curve
}

export interface TravelRule {
  id: string;
  fuelCostPerKm: number;
  domesticMultiplier: number;
  internationalMultiplier: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  basePrice: number;
  includedServices: string[];
  includedTeamSize: number;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface TeamTier {
  id: string;
  teamSize: number;
  price: number;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  isBase: boolean;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Bell curve calculation function (Gaussian)
export function calculateMultiplier(date: Date, period: PricingPeriod): number {
  const peakDate = new Date(period.peakDate);
  const daysFromPeak =
    Math.abs(date.getTime() - peakDate.getTime()) / (1000 * 60 * 60 * 24);
  const { minMultiplier, maxMultiplier, curveWidth } = period;

  // Gaussian function: e^(-(x^2)/(2*sigma^2))
  const gaussian = Math.exp(
    -(daysFromPeak * daysFromPeak) / (2 * curveWidth * curveWidth),
  );

  // Scale from [minMultiplier, maxMultiplier] based on gaussian value
  const multiplier = minMultiplier + (maxMultiplier - minMultiplier) * gaussian;

  return Math.round(multiplier * 100) / 100; // Round to 2 decimal places
}

// Generate data points for the bell curve visualization
export function generateBellCurveData(
  period: PricingPeriod,
): { date: string; multiplier: number; label: string }[] {
  const data: { date: string; multiplier: number; label: string }[] = [];
  const start = new Date(period.startDate);
  const end = new Date(period.endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
    const dateStr = d.toISOString().split("T")[0];
    const multiplier = calculateMultiplier(new Date(d), period);
    data.push({
      date: dateStr,
      multiplier: multiplier,
      label: `${dateStr}: ${multiplier}x`,
    });
  }

  return data;
}

// Calculate distance using Haversine formula (in km)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
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
}

// Default base location (Pristina, Kosovo)
export const PRISTINA_CENTER: [number, number] = [42.6629, 21.1655];

// ============================================
// DEFAULT DATA
// ============================================

export const DEFAULT_PRICING_PERIODS: PricingPeriod[] = [
  {
    id: "1",
    name: "Summer Peak",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    peakDate: "2026-07-15",
    minMultiplier: 1.0,
    maxMultiplier: 1.5,
    curveWidth: 20,
  },
];

export const DEFAULT_TRAVEL_RULE: TravelRule = {
  id: "1",
  fuelCostPerKm: 0.5,
  domesticMultiplier: 1.0,
  internationalMultiplier: 2.0,
};

export const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: "1",
    name: "Essential Wedding",
    basePrice: 1500,
    includedServices: ["Photo shooting", "Photo editing"],
    includedTeamSize: 1,
    description: "Perfect for intimate weddings",
  },
  {
    id: "2",
    name: "Premium Wedding",
    basePrice: 2800,
    includedServices: [
      "Photo shooting",
      "Video recording",
      "Drone footage",
      "Photo editing",
    ],
    includedTeamSize: 2,
    description: "Our most popular package",
  },
  {
    id: "3",
    name: "Luxury Collection",
    basePrice: 4500,
    includedServices: [
      "Photo shooting",
      "Video recording",
      "Drone footage",
      "Same-day edit",
      "Full wedding film",
    ],
    includedTeamSize: 3,
    description: "Complete coverage for your special day",
  },
];

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "1",
    name: "Drone footage",
    price: 250,
    description: "Aerial photography and videography",
    category: "Video",
  },
  {
    id: "2",
    name: "Same-day edit",
    price: 300,
    description: "Edited highlights shown at reception",
    category: "Video",
  },
  {
    id: "3",
    name: "Extra photographer",
    price: 400,
    description: "Additional photographer for full day",
    category: "Team",
  },
  {
    id: "4",
    name: "Extra cameraman",
    price: 400,
    description: "Additional cameraman for full day",
    category: "Team",
  },
  {
    id: "5",
    name: "Extra hour coverage",
    price: 150,
    description: "Additional hour of coverage",
    category: "Time",
  },
  {
    id: "6",
    name: "Photo album",
    price: 350,
    description: "Premium photo album (30 pages)",
    category: "Product",
  },
  {
    id: "7",
    name: "Engagement shoot",
    price: 300,
    description: "Pre-wedding engagement photo session",
    category: "Photo",
  },
];

export const DEFAULT_TEAM_TIERS: TeamTier[] = [
  { id: "1", teamSize: 1, price: 400 },
  { id: "2", teamSize: 2, price: 600 },
  { id: "3", teamSize: 3, price: 850 },
  { id: "4", teamSize: 4, price: 1100 },
];

export const DEFAULT_LOCATIONS: Location[] = [
  {
    id: "1",
    name: "Studio HQ",
    city: "Prishtina",
    country: "Kosovo",
    isBase: true,
  },
  {
    id: "2",
    name: "Novi Sad",
    city: "Novi Sad",
    country: "Serbia",
    isBase: false,
  },
  {
    id: "3",
    name: "Budva",
    city: "Budva",
    country: "Montenegro",
    isBase: false,
  },
  {
    id: "4",
    name: "Prague",
    city: "Prague",
    country: "Czech Republic",
    isBase: false,
  },
];

// City coordinates for distance calculation (lat, lng)
export const CITY_COORDINATES: Record<string, [number, number]> = {
  Prishtina: [42.6629, 21.1655],
  Pristina: [42.6629, 21.1655],
  "Novi Sad": [45.2671, 19.8335],
  Budva: [42.4304, 18.6863],
  Prague: [50.0755, 14.4378],
  Belgrade: [44.7866, 20.4489],
  Skopje: [41.9973, 21.428],
  Tirana: [41.3275, 19.8187],
};

// Calculate distance between cities using coordinates
export function getCityDistance(city1: string, city2: string): number {
  const coords1 = CITY_COORDINATES[city1];
  const coords2 = CITY_COORDINATES[city2];

  if (!coords1 || !coords2) {
    return 0;
  }

  return calculateDistance(coords1[0], coords1[1], coords2[0], coords2[1]);
}
