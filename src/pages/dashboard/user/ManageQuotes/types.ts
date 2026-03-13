/* -- Types -- */
export type QuoteStatus = "not_opened" | "waiting" | "rejected" | "approved";

export type DownPaymentStatus = "done" | "not_done";

export type QuoteItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type Quote = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  description?: string;
  status: QuoteStatus;
  downPayment: DownPaymentStatus;
  downPaymentAmount?: number;
  finalPrice?: number;
  items: QuoteItem[];
  createdAt: string;
};

export const uid = (prefix = "") =>
  `${prefix}${Math.random().toString(36).slice(2, 9)}`;
