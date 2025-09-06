import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
// --- UPDATED: Added all necessary auth functions ---
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';

import Sidebar from './components/Sidebar';
import MedicalPortfolio from './components/MedicalPortfolio';
import AuthModals from './components/AuthModals';

const firebaseConfig = {
    apiKey: "AIzaSyDddK-YS9PWvU9DDuCwNUdPZ-Vi6PwqtQ4",
    authDomain: "curebird-2cb67.firebaseapp.com",
    projectId: "curebird-2cb67",
    storageBucket: "curebird-2cb67.firebasestorage.app",
    messagingSenderId: "256974181423",
    appId: "1:256974181423:web:fd2b7935a0f2c4128662da"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.appId;
// --- NEW: Initialize Google Provider ---
const googleProvider = new GoogleAuthProvider();

const formatDate = (date) => {
    if (!date) return 'N/A';
    if (date.toDate) return date.toDate().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    try {
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'Invalid Date';
        return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
};
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ') : '');

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if(currentUser) {
                setIsAuthModalOpen(false); 
            }
        });
        return () => unsubscribe();
    }, []);

    // --- UPDATED: This now uses REAL Firebase login ---
    const handleLogin = async (email, password) => {
        setAuthError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // The onAuthStateChanged listener will handle setting the user and closing the modal
        } catch (error) {
            console.error("Login Error:", error.message);
            setAuthError(error.message);
        }
    };

    // --- UPDATED: This now uses REAL Firebase sign up ---
    const handleSignUp = async (email, password) => {
        setAuthError(null);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // The onAuthStateChanged listener will handle setting the user and closing the modal
        } catch (error) {
            console.error("Sign Up Error:", error.message);
            setAuthError(error.message);
        }
    };
    
    // --- NEW: This handles Google Sign-In ---
    const handleGoogleSignIn = async () => {
        setAuthError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google Sign-In Error:", error.message);
            setAuthError(error.message);
        }
    };
    
    // --- UPDATED: This now uses REAL Firebase logout ---
    const handleLogout = () => {
        signOut(auth).catch(error => console.error("Logout Error:", error));
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-slate-900 text-white"><p>Loading Application...</p></div>;
    }

    return (
        <div className="min-h-screen font-sans text-slate-200 relative isolate bg-slate-900">
            <div className="flex">
                <Sidebar />
                <main className="flex-1 bg-slate-950">
                    <MedicalPortfolio 
                        user={user}
                        db={db} 
                        appId={appId} 
                        formatDate={formatDate} 
                        capitalize={capitalize} 
                        onLogout={handleLogout}
                        onLoginClick={() => {
                            setIsAuthModalOpen(true);
                            setAuthError(null); // Clear previous errors when opening modal
                        }}
                    />
                </main>
            </div>
            <AnimatePresence>
                {isAuthModalOpen && (
                    <AuthModals 
                        onClose={() => setIsAuthModalOpen(false)}
                        onLogin={handleLogin}
                        onSignUp={handleSignUp}
                        onGoogleSignIn={handleGoogleSignIn} // --- NEW: Pass Google handler
                        capitalize={capitalize}
                        error={authError} // --- NEW: Pass error to modal
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
