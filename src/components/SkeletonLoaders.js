import React from 'react';

export const SkeletonCard = () => (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-md animate-pulse">
        <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
                <div className="bg-slate-800 p-3 rounded-full w-12 h-12"></div>
                <div>
                    <div className="h-4 bg-slate-800 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-slate-800 rounded w-32"></div>
                </div>
            </div>
            <div className="h-4 bg-slate-800 rounded w-16"></div>
        </div>
        <div className="mt-4 pl-16 border-t border-slate-800 pt-4 space-y-2">
            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            <div className="h-3 bg-slate-800 rounded w-2/3"></div>
        </div>
    </div>
);

export const SkeletonDashboard = () => (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                        <div className="h-5 bg-slate-800 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-8 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg h-80 animate-pulse">
            <div className="h-full bg-slate-800 rounded-md"></div>
        </div>
    </>
);
