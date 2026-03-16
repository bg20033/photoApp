export type {
  PricingPeriod,
  TravelRule,
  PricingPlan,
  Service,
  TeamTier,
  Location,
} from "@/lib/pricing";

export interface QuantityTier {
  id: string;
  minQty: number;
  maxQty: number | null; 
  unitPrice: number;
}

export interface QuantityPricingProduct {
  id: string;
  name: string;
  basePrice: number;
  tiers: QuantityTier[];
  description?: string;
  enableDateBasedPricing?: boolean;
}

export const DEFAULT_QUANTITY_PRODUCTS: QuantityPricingProduct[] = [
  {
    id: "1",
    name: "Nicotine Pouch",
    basePrice: 5,
    description: "Premium quality nicotine pouches",
    tiers: [
      { id: "t1", minQty: 1, maxQty: 9, unitPrice: 5 },
      { id: "t2", minQty: 10, maxQty: 49, unitPrice: 4 },
      { id: "t3", minQty: 50, maxQty: 99, unitPrice: 3.5 },
      { id: "t4", minQty: 100, maxQty: null, unitPrice: 3 },
    ],
  },
  {
    id: "2",
    name: "Print Package",
    basePrice: 50,
    description: "Professional photo prints",
    tiers: [
      { id: "t1", minQty: 1, maxQty: 5, unitPrice: 50 },
      { id: "t2", minQty: 6, maxQty: 20, unitPrice: 45 },
      { id: "t3", minQty: 21, maxQty: null, unitPrice: 40 },
    ],
  },
];

export type IconType =
  | "User"
  | "Camera"
  | "Wrench"
  | "Truck"
  | "Clipboard"
  | "Star"
  | "Heart"
  | "Shield"
  | "Zap"
  | "Award";

export interface Role {
  id: string;
  name: string;
  icon: IconType;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleIds: string[];
}

export const DEFAULT_ROLES: Role[] = [
  { id: "1", name: "Photographer", icon: "Camera" },
  { id: "2", name: "Videographer", icon: "Camera" },
  { id: "3", name: "Editor", icon: "Clipboard" },
  { id: "4", name: "Assistant", icon: "User" },
  { id: "5", name: "Driver", icon: "Truck" },
  { id: "6", name: "Technician", icon: "Wrench" },
];

export const DEFAULT_WORKERS: Worker[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@email.com",
    phone: "+1 555-0101",
    roleIds: ["1", "2"],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "+1 555-0102",
    roleIds: ["3"],
  },
  {
    id: "3",
    name: "Mike Brown",
    email: "mike@email.com",
    phone: "+1 555-0103",
    roleIds: ["4", "5"],
  },
];
