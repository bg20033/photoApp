import { Button } from "@/components/ui/button";

export default function Topbar() {
  return (
    <header className="border-b fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="text-xl font-bold">
          PhotoApp
        </a>
        <nav className="flex items-center gap-6">
          <a
            href="/CalculateWorkClient"
            className="text-sm font-medium hover:text-primary"
          >
            Calculator
          </a>
          <a
            href="/CalculateProducts"
            className="text-sm font-medium hover:text-primary"
          >
            Products
          </a>
          <Button asChild size="sm">
            <a href="/Login">Login</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
