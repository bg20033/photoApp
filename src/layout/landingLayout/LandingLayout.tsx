import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

interface LandingLayoutProps {
  children?: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col pt-18 relative">
      <div className="absolute inset-0 z-0 bg-white dark:bg-zinc-950 line border-x border-x-(--pattern-fg) bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed [--pattern-fg:var(--color-black)]/5 dark:[--pattern-fg:var(--color-white)]/10" />
      <Topbar />
      <main className="flex-1 relative z-10">{children ?? <Outlet />}</main>
    </div>
  );
}

