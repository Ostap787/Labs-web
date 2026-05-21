import React, { createContext, useContext, useState } from "react";

const SelectedRestaurantContext = createContext();

export const SelectedRestaurantProvider = ({ children }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  return (
    <SelectedRestaurantContext.Provider
      value={{ selectedRestaurant, setSelectedRestaurant }}
    >
      {children}
    </SelectedRestaurantContext.Provider>
  );
};

export const useSelectedRestaurant = () => useContext(SelectedRestaurantContext);