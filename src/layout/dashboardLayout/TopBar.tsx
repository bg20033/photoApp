import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface TopBarProps {
  onMenuToggle: () => void;
  isMobile: boolean;
}

export default function TopBar({ onMenuToggle, isMobile }: TopBarProps) {
  const navigateToLogout = () => {
    // navigator.navigateTo("/logout")
  };

  return (
    <header className="bg-card">
      <div className="flex h-12 items-center justify-between px-4">
        {isMobile && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onMenuToggle}
            data-mobile-toggle
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <Button size="sm" variant="outline" onClick={navigateToLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
