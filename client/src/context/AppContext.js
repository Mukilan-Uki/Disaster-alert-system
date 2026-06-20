import React, { createContext, useState } from "react";

// Simple React Context to hold global app state (expand as needed)
export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState("Colombo");

  return (
    <AppContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
