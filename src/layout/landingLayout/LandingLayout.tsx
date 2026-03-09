import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

interface LandingLayoutProps {
  children?: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-1">{children ?? <Outlet />}</main>
    </div>
  );
}
