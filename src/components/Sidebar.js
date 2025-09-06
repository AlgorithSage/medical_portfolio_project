import React from 'react';
import { LayoutDashboard, FileText, Calendar, Pill, Settings, HeartPulse } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: <LayoutDashboard size={20} />, name: 'Dashboard' },
        { icon: <FileText size={20} />, name: 'All Records' },
        { icon: <Calendar size={20} />, name: 'Appointments' },
        { icon: <Pill size={20} />, name: 'Medications' },
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
                    {navItems.map((item, index) => (
                        <li key={item.name}>
                            <a href="#" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${index === 0 ? 'bg-slate-800 text-white' : ''}`}>
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
