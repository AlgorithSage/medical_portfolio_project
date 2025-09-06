import React from 'react';
import { Pill } from 'lucide-react';

const Medications = () => (
    <div className="p-8 h-screen text-white">
        <div className="flex items-center gap-4">
            <Pill size={32} className="text-rose-400" />
            <h1 className="text-3xl font-bold">Medications</h1>
        </div>
        <p className="mt-4 text-slate-400">Track your current and past prescriptions and medication schedules here.</p>
    </div>
);

export default Medications;