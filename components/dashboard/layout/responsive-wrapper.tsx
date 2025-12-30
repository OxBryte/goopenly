"use client";

import { MainLayout } from "@/components/dashboard/layout/main-layout";

interface ResponsiveLayoutWrapperProps {
  children: React.ReactNode;
  showUniqueNameModal?: boolean;
}

export function ResponsiveLayoutWrapper({
  children,
  showUniqueNameModal = false,
}: ResponsiveLayoutWrapperProps) {
  return (
    <MainLayout showUniqueNameModal={showUniqueNameModal}>
      {children}
    </MainLayout>
  );
}

