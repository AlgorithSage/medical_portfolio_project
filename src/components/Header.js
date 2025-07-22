import React from 'react';
import { Plus, Share2, Bell, Search, LogIn } from 'lucide-react';

const Header = ({ onAddClick, onShareClick, onLoginClick }) => (
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
            <div className="w-10 h-10 rounded-full bg-slate-700">
                {/* User Avatar */}
            </div>
            <button 
                onClick={onAddClick} 
                className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-sky-600 transition-colors text-sm font-semibold"
            >
                <Plus size={16} />
                Add Record
            </button>
            {/* Login Button for demonstration */}
            <button 
                onClick={onLoginClick} 
                className="flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-lg shadow-sm hover:bg-amber-400 transition-colors text-sm font-semibold"
            >
                <LogIn size={16} />
                Login
            </button>
        </div>
    </header>
);

export default Header;
