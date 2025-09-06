import React from 'react';
import { Calendar } from 'lucide-react';

const Appointments = () => (
    <div className="p-8 h-screen text-white">
        <div className="flex items-center gap-4">
            <Calendar size={32} className="text-amber-400" />
            <h1 className="text-3xl font-bold">Appointments</h1>
        </div>
        <p className="mt-4 text-slate-400">Here you will be able to view and manage your upcoming and past appointments.</p>
    </div>
);

export default Appointments;