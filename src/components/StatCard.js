import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const StatCard = ({ icon, label, value, color, change }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-slate-900 to-sky-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 hover:border-sky-500/50 transition-all duration-300"
    >
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-lg ${color} relative`}>
                {/* Gradient overlay for the icon */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-lg"></div>
                <div className="relative">
                    {icon}
                </div>
            </div>
            <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                <Sparkles size={14} />
                Ask AI
            </button>
        </div>
        <div className="mt-4">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-slate-400 font-medium mt-1">{label}</p>
        </div>
        <div className="mt-4 flex justify-between items-center text-xs">
            {change && (
                <span className="flex items-center font-semibold text-emerald-500">
                    <ArrowUpRight size={14} className="mr-1" />
                    {change} vs last month
                </span>
            )}
            <a href="#" className="text-sky-400 hover:text-sky-300 font-medium">View Details</a>
        </div>
    </motion.div>
);

export default StatCard;
