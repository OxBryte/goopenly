"use client";

import React from "react";
import { ResponsiveLayoutWrapper } from "@/components/dashboard/layout/responsive-wrapper";

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResponsiveLayoutWrapper showUniqueNameModal={false}>
      {children}
    </ResponsiveLayoutWrapper>
  );
}

