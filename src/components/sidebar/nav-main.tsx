"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavMainType = {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
};

export function NavMain({ items }: NavMainType) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (pathname === "rfid/tag") {
      setIsMounted(true);
    }
  }, [isMounted, pathname]);

  if (!isMounted) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>Applications</SidebarGroupLabel>
        <SidebarMenu>
          {items?.map((item) => {
            const hasSubItems = item.items && item.items.length > 0;

            const isItemActive =
              pathname === item.url ||
              item.items?.some((subItem) => pathname === subItem.url);

            if (hasSubItems) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isMounted ? isItemActive : false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={clsx({
                          "bg-chart-2 text-white hover:bg-[oklch(0.8416 0.17 162.48)]":
                            isItemActive,
                        })}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubItemActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a
                                  href={subItem.url}
                                  className={clsx({
                                    "bg-chart-2 text-white hover:bg-[oklch(0.8416 0.17 162.48)]":
                                      isSubItemActive,
                                  })}
                                >
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            const isLinkActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={clsx("flex items-center gap-2 w-full", {
                    "bg-chart-2 text-white hover:bg-[oklch(0.8416 0.17 162.48)]":
                      isLinkActive,
                  })}
                >
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
