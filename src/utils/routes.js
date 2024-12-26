import React from "react";
import Login from "../pages/auth/Login";
import Analytics from "../pages/analytics/Analytics";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import InfluencerManagement from "../pages/influencers/InfluencerManagement";
import VendorManagement from "../pages/vendors/VendorManagement";
import CouponManagement from "../pages/coupon/CouponManagement";
import CouponDetails from "../pages/coupon/CouponDetails";
import Settings from "../pages/settings/Settings";
import VendorDetails from "../pages/vendors/VendorDetails";
import InfluencersDetails from "../pages/influencers/InfluencersDetails";
import Categories from "../pages/categories/Categories";
import Subscriptions from "../pages/subscriptions/Subscriptions";

export const routes = {
    public: [
        // {
        //     path: "/login",
        //     element: React.createElement(Login)
        // },
    ],
    protected: [
        {
            element: React.createElement(ProtectedRoute, {
                children: React.createElement(DashboardLayout)
            }),
            children: [
                {
                    path: "/",
                    element: React.createElement(VendorManagement)
                },
                {
                    path: "/analytics",
                    element: React.createElement(Analytics)
                },
                {
                    path: "/coupons",
                    element: React.createElement(CouponManagement)
                },
                {
                    path: "/categories",
                    element: React.createElement(Categories)
                },
                {
                    path: "/subscriptions",
                    element: React.createElement(Subscriptions)
                },
                {
                    path: "/coupons/:id",
                    element: React.createElement(CouponDetails)
                },
                {
                    path: "/influencers",
                    element: React.createElement(InfluencerManagement)
                },
                {
                    path: "/influencers/:id",
                    element: React.createElement(InfluencersDetails)
                },
                {
                    path: "/vendors",
                    element: React.createElement(VendorManagement)
                },
                {
                    path: "/vendors/:id",
                    element: React.createElement(VendorDetails)
                },
                {
                    path: "/profile",
                    element: React.createElement(Profile)
                },
                {
                    path: "/settings",
                    element: React.createElement(Settings)
                }
            ]
        }
    ]
};
