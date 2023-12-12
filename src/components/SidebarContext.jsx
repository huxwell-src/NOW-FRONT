// SidebarContext.jsx
import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isMiniSidebar, setIsMiniSidebar] = useState(false);

  const toggleSidebarSize = () => {
    setIsMiniSidebar(!isMiniSidebar);
  };

  return (
    <SidebarContext.Provider value={{ isMiniSidebar, toggleSidebarSize }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

SidebarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
