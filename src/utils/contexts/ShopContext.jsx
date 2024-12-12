// ShopContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

import { toast } from "react-toastify";
import { apiService } from "../../api/apiwrapper";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await apiService.get("/shop/user-shops");
        setShops(response.data);
      } catch (error) {
        console.error("Error fetching shops:", error);
        toast.error("Error fetching brands");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        shops,
        loading,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
