"use client";

import React, { createContext, useContext, useState } from "react";

interface DashboardContextType {
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
  refreshVault: number;
  triggerRefresh: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshVault, setRefreshVault] = useState(0);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const triggerRefresh = () => setRefreshVault((prev) => prev + 1);

  return (
    <DashboardContext.Provider
      value={{
        isAddModalOpen,
        openAddModal,
        closeAddModal,
        refreshVault,
        triggerRefresh,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
