import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Library,
  HardDrive,
  Settings,
  Users,
  ShieldCheck,
  CreditCard,
  Camera,
  ChevronLeft,
  Menu,
  Calendar,
  Quote,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

type Role = "admin" | "client" | "user";
const currentRole: Role = "admin";

export default function Sidebar({
  isMobile = false,
  isOpen = true,
}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isExpanded = isHovered || isPinned || (isMobile && isOpen);

  const navigate = useNavigate();

  const navItems = {
    user: [
      { name: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
      { name: "My Photos", href: "/user/manage", icon: ImageIcon },
      { name: "Albums", href: "/dashboard/albums", icon: Library },
      { name: "Storage", href: "/dashboard/manageusers", icon: HardDrive },
      { name: "Settings", href: "/dashboard/manageclients", icon: Settings },
    ],
    client: [
      { name: "Client Portal", href: "/dashboard/client", icon: Camera },
      { name: "Project Files", href: "/dashboard/projects", icon: Library },
      { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    admin: [
      { name: "Admin Panel", href: "/dashboard/admin", icon: ShieldCheck },
      { name: "User Panel", href: "/dashboard/user", icon: ShieldCheck },
      { name: "Client Panel", href: "/dashboard/client", icon: ShieldCheck },
      {
        name: "Manage Clients",
        href: "/dashboard/manageclients",
        icon: HardDrive,
      },
      { name: "Manage Users", href: "/dashboard/manageusers", icon: Settings },
      {
        name: "Event Planner",
        href: "/dashboard/eventplanner",
        icon: Calendar,
      },
      {
        name: "Plans and Services",
        href: "/dashboard/plansandservices",
        icon: Library,
      },
      { name: "Manage Teams", href: "/dashboard/manageteams", icon: Users },
      { name: "Storage", href: "/dashboard/storage", icon: HardDrive },
      {
        name: "Calculate Work",
        href: "/dashboard/calculatework",
        icon: CreditCard,
      },
      { name: "Manage Quotes", href: "/dashboard/managequotes", icon: Quote },
      {
        name: "Upload Material",
        href: "/dashboard/uploadMaterial",
        icon: Upload,
      },
    ],
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isExpanded ? 240 : 72,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-card h-full flex flex-col z-50 overflow-hidden "
    >
      <div
        className="p-4 pt-3 ps-4.5 bg-muted/10"
        onClick={() => navigate("/dashboard/profile")}
      >
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary to-primary/60 border border-primary/20 flex items-center justify-center shrink-0 text-primary-foreground font-bold">
            AA
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 flex-1 overflow-hidden whitespace-nowrap"
              >
                <p className="text-sm font-bold truncate text-foreground">
                  Alex Admin
                </p>
                <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tighter">
                  {currentRole}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex-1 px-3 ">
        <nav className="space-y-1.5">
          {navItems[currentRole].map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center h-11 px-3.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground "
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className="ml-3 text-sm font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
      </div>

      <div
        className={cn(
          "p-2 border-t border-border/50 flex transition-all",
          isExpanded ? "justify-end" : "justify-center",
        )}
      >
        <button
          onClick={() => setIsPinned(!isPinned)}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
