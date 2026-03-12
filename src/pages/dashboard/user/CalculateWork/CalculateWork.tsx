import { useState, useCallback } from "react";
import {
  type PricingPeriod,
  type TravelRule,
  type PricingPlan,
  type Service,
  type Location,
  DEFAULT_PRICING_PERIODS,
  DEFAULT_TRAVEL_RULE,
  DEFAULT_PLANS,
  DEFAULT_SERVICES,
  DEFAULT_LOCATIONS,
} from "@/lib/pricing";

import { BaseLocationCard } from "./BaseLocation";
import { PricingPeriodsCard } from "./PricingPeriod";
import { TravelRulesCard } from "./TravelRules";
import { PlansCard } from "./Plans";
import { ServicesCard } from "./Services";
import { QuantityPricingCard } from "./QuantityPricing";
import {
  QuantityPricingModal,
  PricingPeriodModal,
  PlanModal,
  ServiceModal,
} from "./modals";
import {
  type QuantityPricingProduct,
  DEFAULT_QUANTITY_PRODUCTS,
} from "./types";
import { generateId } from "./utils";

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function CalculateWork() {
  const [pricingPeriods, setPricingPeriods] = useState<PricingPeriod[]>(
    DEFAULT_PRICING_PERIODS,
  );
  const [travelRule, setTravelRule] = useState<TravelRule>(DEFAULT_TRAVEL_RULE);
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PLANS);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [locations] = useState<Location[]>(DEFAULT_LOCATIONS);
  const [quantityProducts, setQuantityProducts] = useState<
    QuantityPricingProduct[]
  >(DEFAULT_QUANTITY_PRODUCTS);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingQuantityProduct, setEditingQuantityProduct] =
    useState<QuantityPricingProduct | null>(null);
  const [editingPeriod, setEditingPeriod] = useState<PricingPeriod | null>(
    null,
  );
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const createItem = useCallback(
    <T extends { id: string }>(
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      data: Omit<T, "id">,
    ) => {
      setter((prev) => [...prev, { ...data, id: generateId() } as T]);
    },
    [],
  );

  const updateItem = useCallback(
    <T extends { id: string }>(
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      id: string,
      data: Partial<T>,
    ) => {
      setter((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item)),
      );
    },
    [],
  );

  const deleteItem = useCallback(
    <T extends { id: string }>(
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      id: string,
      itemName: string,
    ) => {
      if (confirm(`Delete this ${itemName}?`)) {
        setter((prev) => prev.filter((item) => item.id !== id));
      }
    },
    [],
  );

  // Quantity Product handlers
  const handleSaveQuantityProduct = (
    productData: Omit<QuantityPricingProduct, "id">,
  ) => {
    if (editingQuantityProduct) {
      updateItem(setQuantityProducts, editingQuantityProduct.id, productData);
    } else {
      createItem(setQuantityProducts, productData);
    }
    setEditingQuantityProduct(null);
    setIsQuantityModalOpen(false);
  };

  const handleDeleteQuantityProduct = (id: string) => {
    deleteItem(setQuantityProducts, id, "product");
  };

  const handleSavePeriod = (periodData: Omit<PricingPeriod, "id">) => {
    if (editingPeriod) {
      updateItem(setPricingPeriods, editingPeriod.id, periodData);
    } else {
      createItem(setPricingPeriods, periodData);
    }
    setEditingPeriod(null);
    setIsPeriodModalOpen(false);
  };

  const handleDeletePeriod = (id: string) => {
    deleteItem(setPricingPeriods, id, "pricing period");
  };

  const handleSavePlan = (planData: Omit<PricingPlan, "id">) => {
    if (editingPlan) {
      updateItem(setPlans, editingPlan.id, planData);
    } else {
      createItem(setPlans, planData);
    }
    setEditingPlan(null);
    setIsPlanModalOpen(false);
  };

  const handleDeletePlan = (id: string) => {
    deleteItem(setPlans, id, "plan");
  };

  // Service handlers
  const handleSaveService = (serviceData: Omit<Service, "id">) => {
    if (editingService) {
      updateItem(setServices, editingService.id, serviceData);
    } else {
      createItem(setServices, serviceData);
    }
    setEditingService(null);
    setIsServiceModalOpen(false);
  };

  const handleDeleteService = (id: string) => {
    deleteItem(setServices, id, "service");
  };

  // Team Tier handlers
  


  return (
    <div className="space-y-6 p-5">
      <PageHeader
        title="Wedding Pricing Configuration"
        description="Configure pricing settings for your photography business"
      />
      <BaseLocationCard locations={locations} />
      <QuantityPricingCard
        products={quantityProducts}
        onAdd={() => {
          setEditingQuantityProduct(null);
          setIsQuantityModalOpen(true);
        }}
        onEdit={(product) => {
          setEditingQuantityProduct(product);
          setIsQuantityModalOpen(true);
        }}
        onDelete={handleDeleteQuantityProduct}
      />
      <PricingPeriodsCard
        periods={pricingPeriods}
        onAdd={() => {
          setEditingPeriod(null);
          setIsPeriodModalOpen(true);
        }}
        onEdit={(period) => {
          setEditingPeriod(period);
          setIsPeriodModalOpen(true);
        }}
        onDelete={handleDeletePeriod}
      />
      <TravelRulesCard travelRule={travelRule} setTravelRule={setTravelRule} />
      <PlansCard
        plans={plans}
        onAdd={() => {
          setEditingPlan(null);
          setIsPlanModalOpen(true);
        }}
        onEdit={(plan) => {
          setEditingPlan(plan);
          setIsPlanModalOpen(true);
        }}
        onDelete={handleDeletePlan}
      />
      <ServicesCard
        services={services}
        onAdd={() => {
          setEditingService(null);
          setIsServiceModalOpen(true);
        }}
        onEdit={(service) => {
          setEditingService(service);
          setIsServiceModalOpen(true);
        }}
        onDelete={handleDeleteService}
      />
      <QuantityPricingModal
        isOpen={isQuantityModalOpen}
        onClose={() => {
          setIsQuantityModalOpen(false);
          setEditingQuantityProduct(null);
        }}
        onSave={handleSaveQuantityProduct}
        product={editingQuantityProduct}
      />
      <PricingPeriodModal
        isOpen={isPeriodModalOpen}
        onClose={() => {
          setIsPeriodModalOpen(false);
          setEditingPeriod(null);
        }}
        onSave={handleSavePeriod}
        period={editingPeriod}
        existingPeriods={pricingPeriods}
      />
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setEditingPlan(null);
        }}
        onSave={handleSavePlan}
        plan={editingPlan}
        availableServices={services}
      />
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        service={editingService}
      />
    </div>
  );
}
