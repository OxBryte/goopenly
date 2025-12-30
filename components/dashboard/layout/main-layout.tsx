"use client";

import React from "react";
import { Navbar } from "@/components/dashboard/navbar";
import { TabsNav } from "@/components/dashboard/tabs-nav";
import { UniqueNameModal } from "@/components/auth/unique-name-modal";

interface MainLayoutProps {
  children: React.ReactNode;
  showUniqueNameModal?: boolean;
}

export function MainLayout({
  children,
  showUniqueNameModal = false,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showUniqueNameModal && <UniqueNameModal />}
      
      {/* Navbar */}
      <Navbar />

      {/* Tabs Navigation */}
      <TabsNav />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-[1270px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}

