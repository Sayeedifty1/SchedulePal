"use client";

import { DashboardSidebar } from "../components/dashboard-sidebar";

const DashboardPageComponent = () => {
  return (
    <div className="flex h-screen w-full bg-background">
      {/* sidebar */}
      <DashboardSidebar />
    </div>
  );
};

export default DashboardPageComponent;
