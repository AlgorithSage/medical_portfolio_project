import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Stethoscope, Hospital, Pill, HeartPulse, Trash2, Edit } from 'lucide-react';

const RecordCard = ({ record, onEdit, onDelete }) => {
    const ICONS = {
        prescription: <Pill className="text-rose-400" />,
        test_report: <FileText className="text-fuchsia-400" />,
        diagnosis: <Stethoscope className="text-emerald-400" />,
        admission: <Hospital className="text-red-400" />,
        ecg: <HeartPulse className="text-pink-400" />,
        default: <FileText className="text-slate-400" />,
    };

    const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ') : '');
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

    return (
        <motion.div layout initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                    <div className="bg-slate-800/50 p-3 rounded-lg">{ICONS[record.type] || ICONS.default}</div>
                    <div>
                        <h3 className="font-semibold text-white">{capitalize(record.type)}</h3>
                        <p className="text-sm text-slate-400">On {formatDate(record.date)}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <button onClick={onEdit} className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-md transition"><Edit size={16} /></button>
                    <button onClick={onDelete} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition"><Trash2 size={16} /></button>
                </div>
            </div>
            <div className="mt-4 pl-16 border-t border-slate-800 pt-4 text-sm">
                <p><strong className="font-medium text-slate-300">Doctor:</strong> {record.doctorName}</p>
                <p><strong className="font-medium text-slate-300">Facility:</strong> {record.hospitalName}</p>
            </div>
        </motion.div>
    );
};

export default RecordCard;
