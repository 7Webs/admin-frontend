// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    OAuthProvider,
    sendPasswordResetEmail,
    signOut
} from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { apiService } from "../../api/apiwrapper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const user = (await apiService.get("user")).data;
                setUser(user);
            }
            setLoading(false);
            setAuthChecked(true);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            setUser(userCredential.user);
            toast.success("Login successful");
            return userCredential.user;
        } catch (error) {
            toast.error(error.message);
            console.error("Login error:", error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            setUser(userCredential.user);
            toast.success("Google login successful");
            return userCredential.user;
        } catch (error) {
            toast.error(error.message);
            console.error("Google login error:", error);
            throw error;
        }
    };

    const loginWithApple = async () => {
        try {
            const provider = new OAuthProvider('apple.com');
            const userCredential = await signInWithPopup(auth, provider);
            setUser(userCredential.user);
            toast.success("Apple login successful");
            return userCredential.user;
        } catch (error) {
            toast.error(error.message);
            console.error("Apple login error:", error);
            throw error;
        }
    };

    const register = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            setUser(userCredential.user);
            toast.success("Registration successful");
            return userCredential.user;
        } catch (error) {
            toast.error(error.message);
            console.error("Registration error:", error);
            throw error;
        }
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent successfully");
        } catch (error) {
            toast.error(error.message);
            console.error("Password reset error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            toast.success("Logout successful");
            window.location.reload();
        } catch (error) {
            toast.error(error.message);
            console.error("Logout error:", error);
            throw error;
        }
    };

    const updateUser = async (userData) => {
        const updatedUser = await apiService.patch("user", userData);
        setUser(updatedUser.data);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            authChecked,
            login,
            loginWithGoogle,
            loginWithApple,
            logout,
            register,
            resetPassword,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
