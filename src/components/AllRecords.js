import React from 'react';
import { FileText } from 'lucide-react';

const AllRecords = () => (
    <div className="p-8 h-screen text-white">
        <div className="flex items-center gap-4">
            <FileText size={32} className="text-sky-400" />
            <h1 className="text-3xl font-bold">All Records</h1>
        </div>
        <p className="mt-4 text-slate-400">This page will display a detailed list of all your medical records.</p>
    </div>
);

export default AllRecords;