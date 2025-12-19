"use client";
import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStatus } from "@/hooks/use-auth-status";

export function SiteHeader() {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const pathname = usePathname().replace("/", "").replace("-", " ");

  // Don't show sidebar if not authenticated
  if (!isLoading && !isAuthenticated) {
    return null;
  }

  // Show loading state or nothing while checking auth status
  if (isLoading) {
    return null; // Or you could return a loading spinner here
  }
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-1">
        <SidebarTrigger className="" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium capitalize">{pathname}</h1>
      </div>
    </header>
  );
}
