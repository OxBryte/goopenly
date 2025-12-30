"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Package, CreditCard, BarChart3, Wallet } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Links",
    url: "/links",
    icon: Package,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
];

export function TabsNav() {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-border bg-background sticky z-40">
      <div className="mx-auto max-w-[1270px] px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.url || 
              (item.url !== "/dashboard" && pathname?.startsWith(item.url));
            
            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all relative rounded-md",
                  "hover:text-foreground border-b-2 border-transparent -mb-px",
                  "min-w-fit whitespace-nowrap",
                  isActive
                    ? "text-foreground border-b-2 border-primary font-semibold bg-secondary/20"
                    : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

