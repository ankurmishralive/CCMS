import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [complaintData, setComplaintData] = useState({
    category: "",
  });

  const updateComplaintData = (updates) => {
    setComplaintData((currentData) => ({
      ...currentData,
      ...updates,
    }));
  };

  return (
    <AppContext.Provider value={{ complaintData, updateComplaintData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
}
