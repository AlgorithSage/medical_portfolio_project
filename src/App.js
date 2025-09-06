import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
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

// Import all the components, including the new pages
import Sidebar from './components/Sidebar';
import MedicalPortfolio from './components/MedicalPortfolio';
import AuthModals from './components/AuthModals';
import AllRecords from './components/AllRecords';
import Appointments from './components/Appointments';
import Medications from './components/Medications';
import Settings from './components/Settings';
import CureStat from './components/CureStat'; // Import the new CureStat component

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
    
    // This new state manages which page is currently displayed
    const [activeView, setActiveView] = useState('Dashboard');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (email, password) => {
        setAuthError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setAuthError(error.message);
        }
    };

    const handleSignUp = async (email, password) => {
        setAuthError(null);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setAuthError(error.message);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setAuthError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            setAuthError(error.message);
        }
    };
    
    const handleLogout = () => {
        signOut(auth).catch(error => setAuthError(error.message));
    };

    // This function renders the correct page based on the activeView state
    const renderActiveView = () => {
        switch (activeView) {
            case 'Dashboard':
                return <MedicalPortfolio user={user} db={db} appId={appId} formatDate={formatDate} capitalize={capitalize} onLogout={handleLogout} onLoginClick={() => setIsAuthModalOpen(true)} />;
            case 'All Records':
                return <AllRecords />;
            case 'Appointments':
                return <Appointments />;
            case 'Medications':
                return <Medications />;
            case 'Cure Stat':
                return <CureStat />;
            case 'Settings':
                return <Settings />;
            default:
                return <MedicalPortfolio user={user} db={db} appId={appId} formatDate={formatDate} capitalize={capitalize} onLogout={handleLogout} onLoginClick={() => setIsAuthModalOpen(true)} />;
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-slate-900 text-white"><p>Loading Application...</p></div>;
    }

    return (
        <div className="min-h-screen font-sans text-slate-200 relative isolate bg-slate-900">
            <div className="flex">
                <Sidebar 
                    activeView={activeView} 
                    onNavigate={setActiveView} 
                />
                <main className="flex-1 bg-slate-950">
                    {renderActiveView()}
                </main>
            </div>
            <AnimatePresence>
                {isAuthModalOpen && (
                    <AuthModals 
                        user={user}
                        onLogout={handleLogout}
                        onClose={() => setIsAuthModalOpen(false)}
                        onLogin={handleLogin}
                        onSignUp={handleSignUp}
                        onGoogleSignIn={handleGoogleSignIn}
                        capitalize={capitalize}
                        error={authError}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}


