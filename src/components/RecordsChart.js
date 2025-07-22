import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const RecordsChart = ({ data }) => (
     <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-slate-900 to-sky-900 border border-slate-800 p-6 rounded-xl shadow-lg"
    >
        <h3 className="text-lg font-semibold mb-4 text-white">Records Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis allowDecimals={false} stroke="#94a3b8"/>
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                        borderColor: 'rgba(51, 65, 85, 1)',
                        color: '#fff',
                        borderRadius: '0.5rem'
                    }}
                    cursor={{fill: 'rgba(100, 116, 139, 0.1)'}}
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                <Bar dataKey="count" fill="#38bdf8" name="Record Count" barSize={30} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </motion.div>
);

export default RecordsChart;
