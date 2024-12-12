// ShopContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

import { toast } from "react-toastify";
import { apiService } from "../../api/apiwrapper";

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await apiService.get(`deals/top-deals?take=100&skip=0`);
                console.log(response.data);
                setCoupons(response.data);
            } catch (error) {
                console.error("Error fetching coupons:", error);
                toast.error("Error fetching coupons");
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    const updateDeal = async (id, data) => {
        try {
            const response = await apiService.patch(`deals/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating deal:", error);
            toast.error("Error updating deal");
            throw error;
        }
    };

    const getDealById = async (id) => {
        try {
            const response = await apiService.get(`deals/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching deal:", error);
            toast.error("Error fetching deal");
            throw error;
        }
    };

    const deleteDeal = async (id) => {
        try {
            await apiService.delete(`deals/${id}`);
            toast.success("Deal deleted successfully");
        } catch (error) {
            console.error("Error deleting deal:", error);
            toast.error("Error deleting deal");
            throw error;
        }
    };

    const getDealsByShop = async (shopId) => {
        try {
            const response = await apiService.get(`deals/shop/${shopId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching shop deals:", error);
            toast.error("Error fetching shop deals");
            throw error;
        }
    };

    return (
        <CouponContext.Provider
            value={{
                coupons,
                loading,
                updateDeal,
                getDealById,
                deleteDeal,
                getDealsByShop
            }}
        >
            {children}
        </CouponContext.Provider>
    );
};

export const useCoupon = () => useContext(CouponContext);
