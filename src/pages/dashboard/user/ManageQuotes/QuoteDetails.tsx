import { useState, useEffect } from "react";
import { type Quote, type QuoteStatus, type DownPaymentStatus } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface QuoteDetailsModalProps {
  quote: Quote | null;
  onClose: () => void;
  onSave: (quote: Quote) => void;
}

export default function QuoteDetailsModal({
  quote,
  onClose,
  onSave,
}: QuoteDetailsModalProps) {
  const [editedQuote, setEditedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    if (quote) {
      setEditedQuote({ ...quote });
    }
  }, [quote]);

  if (!quote || !editedQuote) return null;

  const handleStatusChange = (value: string) => {
    setEditedQuote((prev) =>
      prev ? { ...prev, status: value as QuoteStatus } : null,
    );
  };

  const handleDownPaymentChange = (value: string) => {
    setEditedQuote((prev) =>
      prev ? { ...prev, downPayment: value as DownPaymentStatus } : null,
    );
  };

  const handleDownPaymentAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setEditedQuote((prev) =>
      prev ? { ...prev, downPaymentAmount: amount } : null,
    );
  };

  const handleFinalPriceChange = (value: string) => {
    const price = parseFloat(value) || 0;
    setEditedQuote((prev) => (prev ? { ...prev, finalPrice: price } : null));
  };

  const handleDescriptionChange = (value: string) => {
    setEditedQuote((prev) => (prev ? { ...prev, description: value } : null));
  };

  const handleSave = () => {
    if (editedQuote) {
      onSave(editedQuote);
    }
  };

  const getStatusBadgevariant = (
    status: QuoteStatus,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "approved":
        return "default";
      case "waiting":
        return "secondary";
      case "rejected":
        return "destructive";
      case "not_opened":
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: QuoteStatus): string => {
    switch (status) {
      case "approved":
        return "Approved";
      case "waiting":
        return "Waiting";
      case "rejected":
        return "Rejected";
      case "not_opened":
      default:
        return "Not Opened";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-background rounded-2xl shadow-xl m-4 flex flex-col">
        <div className="p-6 pb-0 sticky top-0 bg-background z-10 rounded-t-2xl border-b">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Quote Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 ">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Client Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">
                  {editedQuote.name} {editedQuote.surname}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{editedQuote.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p className="font-medium">{editedQuote.phone || "-"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p className="font-medium">
                  {new Date(editedQuote.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Description
            </h3>
            <Textarea
              value={editedQuote.description || ""}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Enter quote description..."
              rows={3}
            />
          </div>
          {editedQuote.items && editedQuote.items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Quote Items
              </h3>
              <div className="border rounded-md">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2 font-medium">Item</th>
                      <th className="text-left p-2 font-medium">Description</th>
                      <th className="text-center p-2 font-medium">Qty</th>
                      <th className="text-right p-2 font-medium">Unit Price</th>
                      <th className="text-right p-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedQuote.items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-muted-foreground">
                          {item.description}
                        </td>
                        <td className="p-2 text-center">{item.quantity}</td>
                        <td className="p-2 text-right">
                          ${item.unitPrice.toLocaleString()}
                        </td>
                        <td className="p-2 text-right font-medium">
                          ${item.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/50 border-t">
                    <tr>
                      <td colSpan={4} className="p-2 text-right font-semibold">
                        Total:
                      </td>
                      <td className="p-2 text-right font-bold">
                        $
                        {(
                          editedQuote.items?.reduce(
                            (sum, item) => sum + item.totalPrice,
                            0,
                          ) || 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Status Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Status Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm">Quote Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getStatusBadgevariant(editedQuote.status)}>
                      {getStatusLabel(editedQuote.status)}
                    </Badge>
                  </div>
                </div>
                <Select
                  value={editedQuote.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_opened">Not Opened</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-sm">Down Payment</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        editedQuote.downPayment === "done"
                          ? "default"
                          : "outline"
                      }
                    >
                      {editedQuote.downPayment === "done" ? "Done" : "Not Done"}
                    </Badge>
                  </div>
                </div>
                <Select
                  value={editedQuote.downPayment}
                  onValueChange={handleDownPaymentChange}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_done">Not Done</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Down Payment Amount</Label>
                  <p className="text-xs text-muted-foreground">
                    How much of the down payment has been received
                  </p>
                </div>
                <Input
                  type="number"
                  className="w-32"
                  value={editedQuote.downPaymentAmount || ""}
                  onChange={(e) =>
                    handleDownPaymentAmountChange(e.target.value)
                  }
                  placeholder="0"
                />
              </div>
            </div>

            {/* Final Price */}
            <div className="mt-4 p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Final Price</Label>
                  <p className="text-xs text-muted-foreground">
                    Total quote amount
                  </p>
                </div>
                <Input
                  type="number"
                  className="w-32"
                  value={editedQuote.finalPrice || ""}
                  onChange={(e) => handleFinalPriceChange(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t sticky rounded-b-2xl bottom-0 bg-background ">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save </Button>
          <Button onClick={handleSave}>Save + Create Account</Button>
        </div>
      </div>
    </div>
  );
}
