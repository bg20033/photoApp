import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    if (!isMobile || !isMobileSidebarOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("aside") && !target.closest("[data-mobile-toggle]")) {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isMobileSidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isMobileSidebarOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar - always visible on desktop */}
      <div className="hidden md:block h-full">
        <Sidebar isMobile={false} isOpen={true} onClose={() => {}} />
      </div>

      {/* Mobile Sidebar - overlay when open */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
          {/* Mobile Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar
              isMobile={true}
              isOpen={isMobileSidebarOpen}
              onClose={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-y-auto border rounded-t-xl md:rounded-tl-xl bg-gray-50">
          <div className="mx-auto w-full">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )};
