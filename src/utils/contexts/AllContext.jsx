import React from 'react';
import { AuthProvider } from './AuthContext';
import { CategoryProvider } from './CategoryContext';
import { ShopProvider } from './ShopContext';
import { SubscriptionProvider } from './SubscriptionContext';

export const AllProviders = ({ children }) => {
    return (
        <AuthProvider>
            <ShopProvider>
                <CategoryProvider>
                    {/* <SubscriptionProvider> */}
                    {children}
                    {/* </SubscriptionProvider> */}
                </CategoryProvider>
            </ShopProvider>
        </AuthProvider>
    );
};

export default AllProviders;
