import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';

import Sidebar from './components/Sidebar';
import MedicalPortfolio from './components/MedicalPortfolio';
import AuthModals from './components/AuthModals';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyC5HGK72mr-AfkMPZqYtIQe0UhIH4FbaMA",
  authDomain: "my-medical-portfolio-df1d9.firebaseapp.com",
  projectId: "my-medical-portfolio-df1d9",
  storageBucket: "my-medical-portfolio-df1d9.appspot.com",
  messagingSenderId: "614986646190",
  appId: "1:614986646190:web:8f145884c24e34890da33f",
  measurementId: "G-WNKGLGC5DD"
};

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.appId;

// --- Helper Functions ---
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

// --- Main App Component ---
export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // This effect will run once to check the initial auth state
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

    // These functions are for demonstration and don't perform real auth
    const handleLogin = (email, password) => {
        console.log("Attempting to log in with:", email);
        // In a real app, you would have: await signInWithEmailAndPassword(auth, email, password);
        return new Promise((resolve) => setTimeout(() => {
             setUser({ uid: 'demo-user' }); // Simulate a user object
             resolve();
        }, 1000));
    };

    const handleSignUp = (email, password) => {
        console.log("Attempting to sign up with:", email);
        // In a real app, you would have: await createUserWithEmailAndPassword(auth, email, password);
         return new Promise((resolve) => setTimeout(() => {
             setUser({ uid: 'demo-user' }); // Simulate a user object
             resolve();
        }, 1000));
    };
    
    const handleLogout = () => {
        console.log("Logging out.");
        setUser(null); // Simulate logout by clearing the user object
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
                        onLoginClick={() => setIsAuthModalOpen(true)}
                    />
                </main>
            </div>
            <AnimatePresence>
                {isAuthModalOpen && (
                    <AuthModals 
                        onClose={() => setIsAuthModalOpen(false)}
                        onLogin={handleLogin}
                        onSignUp={handleSignUp}
                        capitalize={capitalize}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
