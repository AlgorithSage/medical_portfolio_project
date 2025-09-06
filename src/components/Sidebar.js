import React from 'react';
import { LayoutDashboard, FileText, Calendar, Pill, Settings, HeartPulse, Activity } from 'lucide-react';

const Sidebar = ({ activeView, onNavigate }) => {
    // --- ADDED "Cure Stat" to the navigation items ---
    const navItems = [
        { icon: <LayoutDashboard size={20} />, name: 'Dashboard' },
        { icon: <FileText size={20} />, name: 'All Records' },
        { icon: <Calendar size={20} />, name: 'Appointments' },
        { icon: <Pill size={20} />, name: 'Medications' },
        { icon: <Activity size={20} />, name: 'Cure Stat' }, // New Item
        { icon: <Settings size={20} />, name: 'Settings' },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                <div className="bg-sky-500 p-2 rounded-lg">
                    <HeartPulse size={24} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Curebird</h1>
            </div>
            <nav className="p-4">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <button 
                                onClick={() => onNavigate(item.name)} 
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                                    activeView === item.name 
                                    ? 'bg-slate-800 text-white' 
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
