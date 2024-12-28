// SubscriptionContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

import { toast } from "react-toastify";
import { apiService } from "../../api/apiwrapper";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
    const [Subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await apiService.get("subscriptions");
                setSubscriptions(response.data);
            } catch (error) {
                console.error("Error fetching Subscriptions:", error);
                toast.error("Error fetching brands");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    return (
        <SubscriptionContext.Provider
            value={{
                Subscriptions,
                loading,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => useContext(SubscriptionContext);
