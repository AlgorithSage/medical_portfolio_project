import React, { useState, useEffect, useRef } from 'react';
import { Plus, Share2, Bell, Search, LogIn, User, LogOut, Settings } from 'lucide-react';

// A sub-component for the user profile dropdown
const UserProfile = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
                <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-slate-600 hover:border-amber-500 transition-colors"
                    referrerPolicy="no-referrer" // --- THIS LINE WAS ADDED ---
                />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20">
                    <div className="p-4 border-b border-slate-700">
                        <p className="font-semibold text-white truncate">{user.displayName || 'Anonymous User'}</p>
                        <p className="text-sm text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                        <a href="#settings" className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700">
                            <Settings size={16} />
                            <span>Profile Settings</span>
                        </a>
                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-slate-700"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


const Header = ({ user, onAddClick, onShareClick, onLoginClick, onLogout }) => {
    // It will show us the user object in the browser's developer console.
    console.log("User object received in Header:", user);

    return (
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-slate-800">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-1">Welcome back, here's a summary of your medical portfolio.</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search records..." className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-white" />
                </div>
                <button onClick={onShareClick} className="p-2.5 rounded-lg hover:bg-slate-800 border border-slate-700 transition-colors">
                    <Share2 size={20} className="text-slate-400" />
                </button>
                <button className="p-2.5 rounded-lg hover:bg-slate-800 border border-slate-700 transition-colors">
                    <Bell size={20} className="text-slate-400" />
                </button>
                
                <button 
                    onClick={onAddClick} 
                    className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-sky-600 transition-colors text-sm font-semibold"
                >
                    <Plus size={16} />
                    Add Record
                </button>
                
                {user ? (
                    <UserProfile user={user} onLogout={onLogout} />
                ) : (
                    <button 
                        onClick={onLoginClick} 
                        className="flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-lg shadow-sm hover:bg-amber-400 transition-colors text-sm font-semibold"
                    >
                        <LogIn size={16} />
                        Login
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;

