"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import MonkeyIcon from "@/components/icons/monkey";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50",
        className
      )}
    >
      <div className="mx-auto max-w-[1270px] h-full px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center">
            <MonkeyIcon className="size-6" />
          </div>
          <span className="text-base font-display text-foreground font-semibold">
            Openly
          </span>
        </Link>

        {/* Right: Wallet Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-muted"
          aria-label="Wallet"
        >
          <Wallet className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}
