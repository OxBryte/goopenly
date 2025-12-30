import React from "react";

interface DashboardPageLayoutProps {
  children: React.ReactNode;

  header: {
    title: string;
    description?: string;
    icon: React.ElementType;
  };
}

export default function DashboardPageLayout({
  children,
  header,
}: DashboardPageLayoutProps) {
  return (
    <div className="flex flex-col relative w-full gap-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 flex items-center justify-center">
          <header.icon className="size-5 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-display font-semibold text-foreground">
            {header.title}
          </h1>
          {header.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {header.description}
            </p>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}

// Export the new layout components
export { ResponsiveLayoutWrapper } from "./responsive-wrapper";
export { MainLayout } from "./main-layout";
