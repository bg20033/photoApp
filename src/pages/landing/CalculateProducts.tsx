import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

// Photo Printing Product types and defaults
export type PhotoProduct = {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Price per unit for first tier
  tiers: {
    minQuantity: number;
    pricePerUnit: number;
  }[];
};

export const DEFAULT_PHOTO_PRODUCTS: PhotoProduct[] = [
  {
    id: "print-4x6",
    name: "4x6 Print",
    description: "Standard 4x6 inch photo print",
    basePrice: 0.5,
    tiers: [
      { minQuantity: 1, pricePerUnit: 0.5 },
      { minQuantity: 50, pricePerUnit: 0.4 },
      { minQuantity: 100, pricePerUnit: 0.3 },
      { minQuantity: 500, pricePerUnit: 0.2 },
    ],
  },
  {
    id: "print-5x7",
    name: "5x7 Print",
    description: "5x7 inch photo print",
    basePrice: 1.0,
    tiers: [
      { minQuantity: 1, pricePerUnit: 1.0 },
      { minQuantity: 50, pricePerUnit: 0.8 },
      { minQuantity: 100, pricePerUnit: 0.6 },
      { minQuantity: 500, pricePerUnit: 0.4 },
    ],
  },
  {
    id: "print-8x10",
    name: "8x10 Print",
    description: "8x10 inch photo print",
    basePrice: 2.5,
    tiers: [
      { minQuantity: 1, pricePerUnit: 2.5 },
      { minQuantity: 25, pricePerUnit: 2.0 },
      { minQuantity: 50, pricePerUnit: 1.5 },
      { minQuantity: 200, pricePerUnit: 1.0 },
    ],
  },
  {
    id: "print-a4",
    name: "A4 Print",
    description: "A4 size photo print",
    basePrice: 3.0,
    tiers: [
      { minQuantity: 1, pricePerUnit: 3.0 },
      { minQuantity: 25, pricePerUnit: 2.5 },
      { minQuantity: 50, pricePerUnit: 2.0 },
      { minQuantity: 200, pricePerUnit: 1.5 },
    ],
  },
  {
    id: "print-a3",
    name: "A3 Print",
    description: "A3 size photo print",
    basePrice: 5.0,
    tiers: [
      { minQuantity: 1, pricePerUnit: 5.0 },
      { minQuantity: 20, pricePerUnit: 4.0 },
      { minQuantity: 50, pricePerUnit: 3.0 },
      { minQuantity: 100, pricePerUnit: 2.5 },
    ],
  },
  {
    id: "canvas-small",
    name: "Small Canvas",
    description: "Small canvas print",
    basePrice: 25.0,
    tiers: [
      { minQuantity: 1, pricePerUnit: 25.0 },
      { minQuantity: 5, pricePerUnit: 22.0 },
      { minQuantity: 10, pricePerUnit: 18.0 },
    ],
  },
  {
    id: "canvas-medium",
    name: "Medium Canvas",
    description: "Medium canvas print",
    basePrice: 45.0,
    tiers: [
      { minQuantity: 1, pricePerUnit: 45.0 },
      { minQuantity: 5, pricePerUnit: 40.0 },
      { minQuantity: 10, pricePerUnit: 35.0 },
    ],
  },
  {
    id: "canvas-large",
    name: "Large Canvas",
    description: "Large canvas print",
    basePrice: 75.0,
    tiers: [
      { minQuantity: 1, pricePerUnit: 75.0 },
      { minQuantity: 5, pricePerUnit: 65.0 },
      { minQuantity: 10, pricePerUnit: 55.0 },
    ],
  },
  {
    id: "album-20pg",
    name: "Photo Album",
    description: "20-page premium photo album",
    basePrice: 150.0,
    tiers: [
      { minQuantity: 1, pricePerUnit: 150.0 },
      { minQuantity: 3, pricePerUnit: 130.0 },
      { minQuantity: 5, pricePerUnit: 110.0 },
    ],
  },
  {
    id: "album-40pg",
    name: "Photo Album",
    description: "40-page premium photo album",
    basePrice: 250.0,
    tiers: [
      { minQuantity: 1, pricePerUnit: 250.0 },
      { minQuantity: 3, pricePerUnit: 220.0 },
      { minQuantity: 5, pricePerUnit: 190.0 },
    ],
  },
];

// Helper function to get price based on quantity
export function getPriceForQuantity(
  product: PhotoProduct,
  quantity: number,
): number {
  // Sort tiers by minQuantity descending to find the best applicable tier
  const sortedTiers = [...product.tiers].sort(
    (a, b) => b.minQuantity - a.minQuantity,
  );
  const applicableTier = sortedTiers.find(
    (tier) => quantity >= tier.minQuantity,
  );
  return applicableTier?.pricePerUnit ?? product.basePrice;
}

interface CalculateProductsProps {
  quantities?: Record<string, number>;
  onQuantitiesChange?: (quantities: Record<string, number>) => void;
}

export default function CalculateProducts({
  quantities: externalQuantities,
  onQuantitiesChange: externalOnQuantitiesChange,
}: CalculateProductsProps) {
  // Use internal state if no external props provided (for standalone usage)
  const [internalQuantities, setInternalQuantities] = useState<
    Record<string, number>
  >({});

  // Determine whether to use internal or external state
  const quantities = externalQuantities ?? internalQuantities;
  const isControlled =
    externalQuantities !== undefined &&
    externalOnQuantitiesChange !== undefined;

  const handleQuantityChange = (productId: string, value: string) => {
    const val = Math.max(0, parseInt(value) || 0);
    const newQuantities = {
      ...quantities,
      [productId]: val,
    };

    if (isControlled && externalOnQuantitiesChange) {
      externalOnQuantitiesChange(newQuantities);
    } else {
      setInternalQuantities(newQuantities);
    }
  };
  // Calculate photo products price with bulk pricing
  const photoProductsPrice = useMemo(() => {
    return Object.entries(quantities).reduce((total, [productId, quantity]) => {
      if (quantity <= 0) return total;
      const product = DEFAULT_PHOTO_PRODUCTS.find((p) => p.id === productId);
      if (!product) return total;
      const pricePerUnit = getPriceForQuantity(product, quantity);
      return total + pricePerUnit * quantity;
    }, 0);
  }, [quantities]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto my-10 p-4">
      <h1>Photo Products & Prints (Bulk Pricing)</h1>
      <p className="text-xs text-muted-foreground">
        Add quantities to order. Bulk discounts apply automatically.
      </p>
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">
                  Description
                </th>
                <th className="text-center p-3 font-medium">Qty</th>
                <th className="text-right p-3 font-medium">Unit Price</th>
                <th className="text-right p-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {DEFAULT_PHOTO_PRODUCTS.map((product) => {
                const quantity = quantities[product.id] || 0;
                const unitPrice =
                  quantity > 0
                    ? getPriceForQuantity(product, quantity)
                    : product.basePrice;
                const lineTotal = unitPrice * quantity;

                return (
                  <tr key={product.id} className="border-t">
                    <td className="p-3">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground text-xs">
                      {product.description}
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(product.id, e.target.value)
                        }
                        className="w-20 h-8 text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <div className="text-xs text-muted-foreground">
                        {quantity > 0
                          ? `€${unitPrice.toFixed(2)}`
                          : `From €${product.basePrice.toFixed(2)}`}
                      </div>
                      {quantity > 0 &&
                        quantity >=
                          (product.tiers[product.tiers.length - 2]
                            ?.minQuantity || 0) && (
                          <div className="text-[10px] text-green-600">
                            Bulk discount!
                          </div>
                        )}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {lineTotal > 0 ? `€${lineTotal.toFixed(2)}` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {photoProductsPrice > 0 && (
              <tfoot className="bg-muted/30 border-t-2">
                <tr>
                  <td colSpan={4} className="p-3 text-right font-bold">
                     Total
                  </td>
                  <td className="p-3 text-right font-bold text-primary">
                    €{photoProductsPrice.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
