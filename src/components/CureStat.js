import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, MapPin } from 'lucide-react';

// --- Mock Data ---
// In a real application, this data would come from an AI/ML backend API.
const diseaseDataByCity = {
    'Kolkata': [
        { disease: 'Dengue', cases: 1200 },
        { disease: 'Influenza', cases: 950 },
        { disease: 'Typhoid', cases: 600 },
        { disease: 'COVID-19', cases: 450 },
        { disease: 'Cholera', cases: 300 },
    ],
    'Chennai': [
        { disease: 'Dengue', cases: 1100 },
        { disease: 'Chikungunya', cases: 850 },
        { disease: 'Influenza', cases: 750 },
        { disease: 'Typhoid', cases: 500 },
        { disease: 'COVID-19', cases: 350 },
    ],
    'Mumbai': [
        { disease: 'Influenza', cases: 1500 },
        { disease: 'Dengue', cases: 1000 },
        { disease: 'Malaria', cases: 800 },
        { disease: 'Leptospirosis', cases: 550 },
        { disease: 'COVID-19', cases: 500 },
    ],
    'Delhi': [
        { disease: 'Influenza', cases: 1300 },
        { disease: 'Dengue', cases: 1150 },
        { disease: 'Tuberculosis', cases: 700 },
        { disease: 'COVID-19', cases: 650 },
        { disease: 'Pneumonia', cases: 400 },
    ],
     'Bangalore': [
        { disease: 'Influenza', cases: 1250 },
        { disease: 'Dengue', cases: 900 },
        { disease: 'COVID-19', cases: 600 },
        { disease: 'H1N1', cases: 450 },
        { disease: 'Typhoid', cases: 350 },
    ],
};

const COLORS = ['#0ea5e9', '#f43f5e', '#f97316', '#10b981', '#8b5cf6'];

const CureStat = () => {
    const [selectedCity, setSelectedCity] = useState('Kolkata');

    const cityData = useMemo(() => diseaseDataByCity[selectedCity], [selectedCity]);
    const nationalData = useMemo(() => {
        const nationalCounts = {};
        Object.values(diseaseDataByCity).forEach(cityDiseases => {
            cityDiseases.forEach(d => {
                nationalCounts[d.disease] = (nationalCounts[d.disease] || 0) + d.cases;
            });
        });
        return Object.entries(nationalCounts).map(([disease, cases]) => ({ disease, cases })).sort((a,b) => b.cases - a.cases).slice(0, 5);
    }, []);


    return (
        <div className="p-4 sm:p-6 lg:p-8 h-screen overflow-y-auto text-white">
            <div className="flex items-center gap-4 mb-8">
                <Activity size={32} className="text-sky-400" />
                <h1 className="text-3xl font-bold">Cure Stat: Disease Trends</h1>
            </div>

            {/* City Selector */}
            <div className="mb-8">
                <label htmlFor="city-select" className="flex items-center gap-2 text-slate-400 mb-2">
                    <MapPin size={16} />
                    Select a city to view local trends:
                </label>
                <select 
                    id="city-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full max-w-xs bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    {Object.keys(diseaseDataByCity).map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* City-specific Bar Chart */}
                <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Top 5 Disease Trends in {selectedCity}</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={cityData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis type="number" stroke="#94a3b8" />
                            <YAxis type="category" dataKey="disease" stroke="#94a3b8" width={100} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} cursor={{fill: 'rgba(14, 165, 233, 0.1)'}} />
                            <Legend />
                            <Bar dataKey="cases" name="Reported Cases" fill="#0ea5e9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* City-specific Pie Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-lg">
                     <h2 className="text-xl font-semibold mb-4">Case Distribution</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={cityData} dataKey="cases" nameKey="disease" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {cityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* National Trends */}
            <div className="mt-12 bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">National Disease Overview (Top 5)</h2>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={nationalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="disease" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8"/>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} cursor={{fill: 'rgba(14, 165, 233, 0.1)'}} />
                        <Legend />
                        <Bar dataKey="cases" name="Total Reported Cases" fill="#f43f5e" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default CureStat;