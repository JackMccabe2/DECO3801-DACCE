// contexts/UserContext.js
import React, { createContext, useState, useContext } from "react";

// Create the context
const UserContext = createContext();

// Create a provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming the context easily
export const useUser = () => useContext(UserContext);