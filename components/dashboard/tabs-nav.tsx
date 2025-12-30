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
    <div className="w-full border-b border-border bg-background">
      <div className="mx-auto max-w-[1270px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.url || 
              (item.url !== "/dashboard" && pathname?.startsWith(item.url));
            
            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                  "hover:text-foreground border-b-2 border-transparent",
                  isActive
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

