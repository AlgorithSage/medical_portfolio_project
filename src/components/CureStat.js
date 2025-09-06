import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Loader, ServerCrash } from 'lucide-react';

const CureStat = () => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDiseaseTrends = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5001/api/disease-trends');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTrends(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch disease trends:", err);
                setError("Could not connect to the AI analysis server. Please ensure the backend is running.");
            } finally {
                setLoading(false);
            }
        };
        fetchDiseaseTrends();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    if (loading) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-white">
                <Loader size={48} className="animate-spin text-sky-500" />
                <p className="mt-4 text-lg">Contacting AI Analysis Server...</p>
                <p className="text-sm text-slate-400">Fetching real-time trend data.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-white">
                <ServerCrash size={48} className="text-red-500" />
                <p className="mt-4 text-lg text-red-400 font-semibold">Error Fetching Data</p>
                <p className="text-sm text-slate-400 text-center max-w-md">{error}</p>
            </div>
        );
    }
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 h-screen overflow-y-auto text-white">
            <header className="pb-6 border-b border-slate-800">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Activity size={32} /> Cure Stat</h1>
                <p className="text-slate-400 mt-1">Analysis of disease outbreaks across India (Data from 2022).</p>
            </header>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart for Outbreaks per Disease */}
                <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                    <h2 className="text-xl font-semibold mb-4">Total Outbreaks by Disease</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={trends.slice(0, 10)} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="disease" stroke="#9ca3af" fontSize={10} interval={0} angle={-45} textAnchor="end" height={120} />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend />
                            <Bar dataKey="outbreaks" fill="#0ea5e9" name="Total Outbreaks" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart for Top 5 Diseases */}
                <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                    <h2 className="text-xl font-semibold mb-4">Outbreak Distribution (Top 5 Diseases)</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={trends.slice(0, 5)}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="outbreaks"
                                nameKey="disease"
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            >
                                {trends.slice(0, 5).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CureStat;

