import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { Pill, Plus, Stethoscope, Hospital } from 'lucide-react';

import Header from './Header';
import { SkeletonCard } from './SkeletonLoaders';

const MedicationCard = ({ med, records }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-800/50 p-4 rounded-lg"
    >
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{med.name}</h3>
            <div className="text-sm text-slate-400 bg-slate-700 px-2 py-1 rounded">
                {med.dosage}
            </div>
        </div>
        <p className="text-sm text-slate-300 mt-1">{med.frequency}</p>
        
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-sm">
            <p className="text-slate-400">Last prescribed on: <span className="font-semibold text-slate-200">{med.lastPrescribed}</span></p>
             <div className="flex items-center gap-2 text-slate-400">
                <Stethoscope size={14} />
                <span>Dr. {records[0].doctorName}</span>
            </div>
             <div className="flex items-center gap-2 text-slate-400">
                <Hospital size={14} />
                <span>{records[0].hospitalName}</span>
            </div>
        </div>
    </motion.div>
);


const Medications = ({ user, db, appId, onLogout, onLoginClick, onToggleSidebar, formatDate }) => {
    const [medications, setMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const userId = user ? user.uid : null;

    const prescriptionsCollectionRef = useMemo(() => {
        if (userId) {
            // Query to only get records that are prescriptions
            return query(
                collection(db, `artifacts/${appId}/users/${userId}/medical_records`),
                where("type", "==", "prescription")
            );
        }
        return null;
    }, [userId, db, appId]);

    useEffect(() => {
        if (prescriptionsCollectionRef) {
            const unsubscribe = onSnapshot(prescriptionsCollectionRef, (querySnapshot) => {
                const allPrescribedMeds = [];
                querySnapshot.forEach(doc => {
                    const record = doc.data();
                    if (record.details && record.details.medications) {
                        record.details.medications.forEach(med => {
                            allPrescribedMeds.push({
                                ...med,
                                recordDate: record.date,
                                doctorName: record.doctorName,
                                hospitalName: record.hospitalName,
                            });
                        });
                    }
                });

                // Group medications by name to create a unique list
                const groupedMeds = allPrescribedMeds.reduce((acc, med) => {
                    const name = med.name.toLowerCase();
                    if (!acc[name]) {
                        acc[name] = [];
                    }
                    acc[name].push(med);
                    return acc;
                }, {});

                // Get the latest details for each unique medication
                const uniqueMeds = Object.values(groupedMeds).map(medRecords => {
                    // Sort by date to find the most recent prescription
                    medRecords.sort((a, b) => b.recordDate.toMillis() - a.recordDate.toMillis());
                    const latestRecord = medRecords[0];
                    return {
                        name: latestRecord.name,
                        dosage: latestRecord.dosage,
                        frequency: latestRecord.frequency,
                        lastPrescribed: formatDate(latestRecord.recordDate),
                        records: medRecords, // Keep all records for history
                    };
                });
                
                setMedications(uniqueMeds);
                setIsLoading(false);

            }, (error) => {
                console.error("Error fetching medications: ", error);
                setIsLoading(false);
            });
            return () => unsubscribe();
        } else {
            setIsLoading(false);
            setMedications([]);
        }
    }, [prescriptionsCollectionRef, formatDate]);

     if (!user) {
        return (
             <div className="p-4 sm:p-6 lg:p-8 h-screen overflow-y-auto text-white">
                <Header 
                    title="Medications"
                    description="Log in to manage your medication history."
                    user={null}
                    onLoginClick={onLoginClick}
                    onToggleSidebar={onToggleSidebar}
                />
                 <div className="text-center py-20">
                    <p className="text-slate-400">Please log in to view your medications.</p>
                 </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-screen overflow-y-auto text-white">
            <Header 
                title="Medications"
                description="A summary of all your prescribed medications."
                user={user}
                onLogout={onLogout}
                onToggleSidebar={onToggleSidebar}
            />
            
            <main className="mt-8">
                 {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SkeletonCard /><SkeletonCard /><SkeletonCard />
                    </div>
                ) : (
                    medications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {medications.map(med => (
                                    <MedicationCard key={med.name} med={med} records={med.records} />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-lg shadow-sm">
                            <Pill size={48} className="mx-auto text-slate-400" />
                            <h3 className="mt-4 text-xl text-slate-300">No Medications Found</h3>
                            <p className="text-slate-500 mt-2">Add a new 'Prescription' record to see your medications here.</p>
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

export default Medications;