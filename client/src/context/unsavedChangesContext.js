import { createContext, useContext, useState } from "react";

const UnsavedChangesContext = createContext();

export const UnsavedChangesProvider = ({ children }) => {
  const [hasChanges, setHasChanges] = useState(false);
  return (
    <UnsavedChangesContext.Provider value={{ hasChanges, setHasChanges }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => useContext(UnsavedChangesContext);
