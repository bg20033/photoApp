import { Button } from "@/components/ui/button";

export default function Topbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="text-xl font-bold">
          PhotoApp
        </a>
        <nav className="flex items-center gap-6">
          {/* <a href="/AboutUs" className="text-sm font-medium hover:text-primary">
            About Us
          </a> */}
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
