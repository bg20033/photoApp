import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TagIcon,
  Add01Icon,
  PencilEdit01Icon,
  Delete01Icon,
  TrendingDown,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type QuantityPricingProduct, type QuantityTier } from "./types";
import { generateId } from "./utils";

// ============================================
// QUANTITY PRICING CARD
// ============================================

interface QuantityPricingCardProps {
  products: QuantityPricingProduct[];
  onAdd: () => void;
  onEdit: (product: QuantityPricingProduct) => void;
  onDelete: (id: string) => void;
}

export function QuantityPricingCard({
  products,
  onAdd,
  onEdit,
  onDelete,
}: QuantityPricingCardProps) {
  const calculateSavings = (basePrice: number, tierPrice: number) => {
    const savings = ((basePrice - tierPrice) / basePrice) * 100;
    return savings > 0 ? Math.round(savings) : 0;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon icon={TagIcon} className="size-5" />
          Quantity-Based Pricing
        </CardTitle>
        <Button size="sm" onClick={onAdd}>
          <HugeiconsIcon icon={Add01Icon} className="size-4 mr-1" /> Add Product
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg">
              <div className="flex justify-between items-start p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                  </div>
                  {product.description && (
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xl"
                    onClick={() => onEdit(product)}
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} className="size-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xl"
                    className="text-destructive"
                    onClick={() => onDelete(product.id)}
                  >
                    <HugeiconsIcon icon={Delete01Icon} className="size-5" />
                  </Button>
                </div>
              </div>

              <div className="bg-muted/30 overflow-hidden border-y">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 font-medium">Quantity</th>
                      <th className="text-left p-2 font-medium">Unit Price</th>
                      <th className="text-left p-2 font-medium">Savings</th>
                      <th className="text-right p-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.tiers.map((tier, idx) => {
                      const qtyDisplay = tier.maxQty
                        ? `${tier.minQty} - ${tier.maxQty}`
                        : `${tier.minQty}+`;
                      const savings = calculateSavings(
                        product.basePrice,
                        tier.unitPrice,
                      );
                      const totalPrice = tier.maxQty
                        ? tier.maxQty * tier.unitPrice
                        : tier.minQty * tier.unitPrice * 2;

                      return (
                        <tr
                          key={tier.id}
                          className={
                            idx !== product.tiers.length - 1 ? "border-b" : ""
                          }
                        >
                          <td className="p-2">
                            <Badge variant="outline" className="font-mono">
                              {qtyDisplay}
                            </Badge>
                          </td>
                          <td className="p-2 font-medium">
                            €{tier.unitPrice.toFixed(2)}
                          </td>
                          <td className="p-2">
                            {savings > 0 ? (
                              <span className="text-green-600 flex items-center gap-1 text-xs">
                                <HugeiconsIcon
                                  icon={TrendingDown}
                                  className="size-3"
                                />
                                {savings}% off
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                Base price
                              </span>
                            )}
                          </td>
                          <td className="p-2 text-right text-muted-foreground">
                            €{totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{product.tiers.length} tiers</span>
                <span>•</span>
                {product.enableDateBasedPricing ? (
                  <Badge variant="default" className="bg-green-500">
                    Date-based
                  </Badge>
                ) : (
                  <Badge variant="secondary">Standard</Badge>
                )}
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No quantity pricing products configured</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={onAdd}
              >
                Add your first product
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// QUANTITY PRICING MODAL
// ============================================

interface QuantityPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<QuantityPricingProduct, "id">) => void;
  product?: QuantityPricingProduct | null;
}

export function QuantityPricingModal({
  isOpen,
  onClose,
  onSave,
  product,
}: QuantityPricingModalProps) {
  const [name, setName] = useState(product?.name || "");
  const [basePrice, setBasePrice] = useState(product?.basePrice || 0);
  const [description, setDescription] = useState(product?.description || "");
  const [enableDateBasedPricing, setEnableDateBasedPricing] = useState(
    product?.enableDateBasedPricing ?? false,
  );
  const [tiers, setTiers] = useState<QuantityTier[]>(
    product?.tiers || [
      { id: generateId(), minQty: 1, maxQty: 9, unitPrice: 0 },
    ],
  );

  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newMinQty = lastTier ? (lastTier.maxQty || lastTier.minQty) + 1 : 1;
    setTiers([
      ...tiers,
      {
        id: generateId(),
        minQty: newMinQty,
        maxQty: newMinQty + 9,
        unitPrice: lastTier?.unitPrice || 0,
      },
    ]);
  };

  const updateTier = (id: string, updates: Partial<QuantityTier>) => {
    setTiers(
      tiers.map((tier) => (tier.id === id ? { ...tier, ...updates } : tier)),
    );
  };

  const removeTier = (id: string) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((t) => t.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, basePrice, description, tiers, enableDateBasedPricing });
    onClose();
  };

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setName(product.name);
      setBasePrice(product.basePrice);
      setDescription(product.description || "");
      setEnableDateBasedPricing(product.enableDateBasedPricing ?? false);
      setTiers(product.tiers);
    } else {
      setName("");
      setBasePrice(0);
      setDescription("");
      setEnableDateBasedPricing(false);
      setTiers([{ id: generateId(), minQty: 1, maxQty: 9, unitPrice: 0 }]);
    }
  }, [product]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? "Edit Quantity Product" : "Add Quantity Product"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Nicotine Pouch"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="basePrice">Base Price (€)</Label>
            <Input
              id="basePrice"
              type="number"
              min="0"
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(parseFloat(e.target.value))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Single unit (Tier 1 default)
            </p>
          </div>
          <div className="space-y-2">
            <Label>Date-based pricing</Label>
            <div className="flex items-center h-7">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableDateBasedPricing}
                  onChange={(e) => setEnableDateBasedPricing(e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm">True</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="w-full p-2 border rounded-md text-sm min-h-15"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional product description"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Quantity Tiers</Label>
            <Button type="button" size="sm" variant="outline" onClick={addTier}>
              <HugeiconsIcon icon={Add01Icon} className="size-4 mr-1" />
              Add Tier
            </Button>
          </div>

          <div className="space-y-2 max-h-50 overflow-y-auto border rounded-md p-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="grid grid-cols-12 gap-2 items-center p-2 bg-muted/30 rounded"
              >
                <div className="col-span-3">
                  <Label className="text-xs">Min Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={tier.minQty}
                    onChange={(e) =>
                      updateTier(tier.id, {
                        minQty: parseInt(e.target.value),
                      })
                    }
                    className="h-8"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Label className="text-xs">Max Qty</Label>
                  <Input
                    type="number"
                    min={tier.minQty}
                    value={tier.maxQty || ""}
                    onChange={(e) =>
                      updateTier(tier.id, {
                        maxQty: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    placeholder="∞"
                    className="h-8"
                  />
                </div>
                <div className="col-span-4">
                  <Label className="text-xs">Unit Price (€)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tier.unitPrice}
                    onChange={(e) =>
                      updateTier(tier.id, {
                        unitPrice: parseFloat(e.target.value),
                      })
                    }
                    className="h-8"
                    required
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  {tiers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-destructive"
                      onClick={() => removeTier(tier.id)}
                    >
                      <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Leave Max Qty empty for unlimited. Price automatically decreases as
            quantity increases.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{product ? "Update" : "Add"}</Button>
        </div>
      </form>
    </Modal>
  );
}
