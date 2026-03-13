import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  uid,
  type Quote,
  type QuoteStatus,
  type DownPaymentStatus,
} from "./types";
import QuoteDetailsModal from "./QuoteDetails";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function apiFetchQuotes(): Promise<Quote[]> {
  try {
    const res = await fetch("/api/user/quotes");
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    return data as Quote[];
  } catch {
    return [
      {
        id: uid("q_"),
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        phone: "+1 555-0100",
        description: "Wedding photography package",
        status: "waiting",
        downPayment: "not_done",
        finalPrice: 2500,
        downPaymentAmount: 0,
        items: [
          {
            id: uid("i_"),
            name: "Photography",
            description: "8 hours coverage",
            quantity: 1,
            unitPrice: 1500,
            totalPrice: 1500,
          },
          {
            id: uid("i_"),
            name: "Album",
            description: "20-page premium album",
            quantity: 1,
            unitPrice: 500,
            totalPrice: 500,
          },
          {
            id: uid("i_"),
            name: "prints",
            description: "50 4x6 prints",
            quantity: 50,
            unitPrice: 10,
            totalPrice: 500,
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: uid("q_"),
        name: "Jane",
        surname: "Smith",
        email: "jane.smith@example.com",
        phone: "+1 555-0200",
        description: "Corporate event photography",
        status: "approved",
        downPayment: "done",
        finalPrice: 5000,
        downPaymentAmount: 2500,
        items: [
          {
            id: uid("i_"),
            name: "Event Coverage",
            description: "Full day corporate event",
            quantity: 1,
            unitPrice: 3500,
            totalPrice: 3500,
          },
          {
            id: uid("i_"),
            name: "Headshots",
            description: "Team headshots session",
            quantity: 10,
            unitPrice: 150,
            totalPrice: 1500,
          },
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: uid("q_"),
        name: "Bob",
        surname: "Johnson",
        email: "bob.j@example.com",
        description: "Portrait session",
        status: "not_opened",
        downPayment: "not_done",
        items: [],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: uid("q_"),
        name: "Alice",
        surname: "Williams",
        email: "alice.w@example.com",
        description: "Product photography",
        status: "rejected",
        downPayment: "not_done",
        finalPrice: 1800,
        items: [
          {
            id: uid("i_"),
            name: "Product Shots",
            description: "10 products",
            quantity: 10,
            unitPrice: 180,
            totalPrice: 1800,
          },
        ],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ];
  }
}

function getStatusBadgevariant(
  status: QuoteStatus,
): "default" | "secondary" | "destructive" | "outline" {
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
}

function getStatusLabel(status: QuoteStatus): string {
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
}

function getDownPaymentBadgevariant(
  status: DownPaymentStatus,
): "default" | "secondary" | "destructive" | "outline" {
  return status === "done" ? "default" : "outline";
}

export default function ManageQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadQuotes() {
      setLoading(true);
      try {
        const data = await apiFetchQuotes();
        if (isMounted) {
          setQuotes(data);
        }
      } catch (error) {
        console.error("Failed to load quotes", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadQuotes();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleUpdateQuote(updated: Quote) {
    setQuotes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setSelectedQuote(null);
  }

  const columns: ColumnDef<Quote>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">
              {quote.name} {quote.surname}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {quote.description || "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const quote = row.original;
        return <span className="text-sm truncate">{quote.email}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <Badge variant={getStatusBadgevariant(quote.status)}>
            {getStatusLabel(quote.status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "downPayment",
      header: "Down Payment",
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <Badge variant={getDownPaymentBadgevariant(quote.downPayment)}>
            {quote.downPayment === "done" ? "Done" : "Not Done"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "downPaymentAmount",
      header: "Down P. Amount",
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <span className="font-medium">
            {quote.downPaymentAmount
              ? `${quote.downPaymentAmount.toLocaleString()}`
              : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "finalPrice",
      header: "Final Price",
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <span className="font-medium">
            {quote.finalPrice ? `$${quote.finalPrice.toLocaleString()}` : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <span className="text-sm">
            {new Date(quote.createdAt).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedQuote(quote)}
          >
            View Details
          </Button>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-400 mx-auto flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-5 mx-auto">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Manage Quotes</h1>
          <p className="text-muted-foreground">View and manage client quotes</p>
        </div>
      </header>

      <DataTable
        columns={columns}
        data={quotes}
        getRowId={(row: Quote) => row.id}
        searchable
        searchColumn="name"
        searchPlaceholder="Search quotes..."
        pageSize={10}
      />

      <QuoteDetailsModal
        quote={selectedQuote}
        onClose={() => setSelectedQuote(null)}
        onSave={handleUpdateQuote}
      />
    </div>
  );
}
