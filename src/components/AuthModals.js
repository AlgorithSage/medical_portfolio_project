import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Stethoscope, Hospital, X } from 'lucide-react';

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ') : '');

const ModalWrapper = ({ onClose, children }) => (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
        onClick={onClose}
    >
        <motion.div 
            initial={{ y: -50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 50, opacity: 0 }}
            className="w-full max-w-md bg-black/40 backdrop-blur-lg border border-amber-500/20 rounded-2xl shadow-2xl shadow-amber-500/10" 
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </motion.div>
    </motion.div>
);

const AuthForm = ({ ctaText, activeTab }) => (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div>
            <label className="text-xs text-slate-400" htmlFor="email">{capitalize(activeTab)} ID / Email</label>
            <input 
                id="email"
                name="email"
                type="email" 
                placeholder={`Enter your ${activeTab} email`}
                className="w-full mt-1 p-3 border bg-slate-800/50 border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500" 
            />
        </div>
        <div>
            <label className="text-xs text-slate-400" htmlFor="password">Password</label>
            <input 
                id="password"
                name="password"
                type="password" 
                placeholder="Enter your password"
                className="w-full mt-1 p-3 border bg-slate-800/50 border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500" 
            />
        </div>
        <button type="submit" className="w-full bg-amber-500 text-slate-900 py-3 rounded-lg hover:bg-amber-400 font-semibold transition-colors">
            {ctaText}
        </button>
    </form>
);

const AuthModals = ({ onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [activeTab, setActiveTab] = useState('patient');

    const tabs = [
        { id: 'patient', name: 'Patient', icon: <User size={20} /> },
        { id: 'doctor', name: 'Doctor', icon: <Stethoscope size={20} /> },
        { id: 'hospital', name: 'Hospital', icon: <Hospital size={20} /> },
    ];

    return (
        <ModalWrapper onClose={onClose}>
            <div className="p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
                <h1 className="text-3xl font-bold text-center text-white mb-2">{isLoginView ? 'Welcome Back' : 'Create an Account'}</h1>
                <p className="text-center text-slate-400 mb-8">{isLoginView ? 'Securely access your medical portfolio.' : 'Join and start managing your health records.'}</p>
                
                <div className="flex border-b border-slate-700 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-colors ${
                                activeTab === tab.id ? 'text-amber-400' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab.icon}
                            {tab.name}
                            {activeTab === tab.id && (
                                <motion.div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-amber-400" layoutId="underline" />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AuthForm 
                            ctaText={`${isLoginView ? 'Login' : 'Sign Up'} as ${capitalize(activeTab)}`}
                            activeTab={activeTab}
                        />
                    </motion.div>
                </AnimatePresence>
                
                <p className="text-center text-sm text-slate-400 mt-6">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-amber-400 hover:text-amber-300 ml-1">
                        {isLoginView ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </ModalWrapper>
    );
};

export default AuthModals;
