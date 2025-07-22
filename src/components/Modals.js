import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, AlertTriangle, Trash2, UploadCloud } from 'lucide-react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ModalWrapper = ({ onClose, children }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {children}
        </motion.div>
    </motion.div>
);

export const RecordFormModal = ({ onClose, record, userId, appId, db }) => {
    const storage = getStorage(db.app);
    const [type, setType] = useState(record?.type || 'prescription');
    const [formData, setFormData] = useState({});
    const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '' }]);
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (record) {
            const date = record.date?.toDate ? record.date.toDate().toISOString().split('T')[0] : '';
            const admissionDate = record.details?.admissionDate?.toDate ? record.details.admissionDate.toDate().toISOString().split('T')[0] : '';
            const dischargeDate = record.details?.dischargeDate?.toDate ? record.details.dischargeDate.toDate().toISOString().split('T')[0] : '';
            setFormData({ ...record, date, details: { ...record.details, admissionDate, dischargeDate } });
            if (record.type === 'prescription' && record.details.medications) setMedications(record.details.medications);
        } else {
            setFormData({ date: new Date().toISOString().split('T')[0], details: {} });
        }
    }, [record]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleDetailsChange = (e) => setFormData(prev => ({ ...prev, details: { ...prev.details, [e.target.name]: e.target.value } }));
    const handleMedicationChange = (index, e) => {
        const newMeds = [...medications];
        newMeds[index][e.target.name] = e.target.value;
        setMedications(newMeds);
    };
    const addMedication = () => setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
    const removeMedication = (index) => setMedications(medications.filter((_, i) => i !== index));

    const handleSave = async (e) => {
        e.preventDefault();
        
        const saveRecord = async (fileURL = null) => {
            const recordToSave = { ...formData, type };
            if (fileURL) {
                recordToSave.fileURL = fileURL;
                recordToSave.fileName = file.name;
            }
            recordToSave.date = new Date(recordToSave.date);
            if (type === 'prescription') recordToSave.details.medications = medications;
            if (type === 'admission') {
                if (recordToSave.details.admissionDate) recordToSave.details.admissionDate = new Date(recordToSave.details.admissionDate);
                if (recordToSave.details.dischargeDate) recordToSave.details.dischargeDate = new Date(recordToSave.details.dischargeDate);
            }

            const recordsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/medical_records`);
            if (recordToSave.id) {
                const { id, ...dataToUpdate } = recordToSave;
                const recordRef = doc(recordsCollectionRef, id);
                await updateDoc(recordRef, dataToUpdate);
            } else {
                await addDoc(recordsCollectionRef, recordToSave);
            }
            onClose();
        };

        if (file) {
            setIsUploading(true);
            const storageRef = ref(storage, `medical_records/${userId}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                }, 
                (error) => {
                    console.error("Upload failed:", error);
                    setIsUploading(false);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        saveRecord(downloadURL);
                    });
                }
            );
        } else {
            saveRecord(record?.fileURL || null);
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white">{record ? 'Edit' : 'Add'} Medical Record</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-200"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="date" name="date" value={formData.date || ''} onChange={handleInputChange} className="w-full p-2 border bg-transparent border-slate-600 rounded-md text-white" required />
                    <select name="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border bg-slate-800 border-slate-600 rounded-md text-white">
                        <option value="prescription">Prescription</option><option value="test_report">Test Report</option><option value="diagnosis">Diagnosis</option>
                        <option value="admission">Hospital Admission</option><option value="ecg">ECG</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="doctorName" placeholder="Doctor's Name" value={formData.doctorName || ''} onChange={handleInputChange} className="w-full p-2 border bg-transparent border-slate-600 rounded-md text-white" required />
                    <input type="text" name="hospitalName" placeholder="Hospital/Clinic Name" value={formData.hospitalName || ''} onChange={handleInputChange} className="w-full p-2 border bg-transparent border-slate-600 rounded-md text-white" required />
                </div>
                
                <div className="pt-4 border-t border-slate-700">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Upload Document (PDF, IMG, etc.)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                            <div className="flex text-sm text-slate-400">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-sky-400 hover:text-sky-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-900 focus-within:ring-sky-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-slate-500">{file ? file.name : 'No file selected'}</p>
                        </div>
                    </div>
                </div>

                {isUploading && (
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div key={type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        {type === 'prescription' && (
                            <div className="space-y-3 pt-4 border-t border-slate-700">
                                <h4 className="font-medium text-white">Medications</h4>
                                {medications.map((med, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                                        <input type="text" name="name" placeholder="Medication Name" value={med.name} onChange={e => handleMedicationChange(index, e)} className="p-2 border bg-transparent border-slate-600 rounded-md md:col-span-2 text-white" required/>
                                        <input type="text" name="dosage" placeholder="Dosage" value={med.dosage} onChange={e => handleMedicationChange(index, e)} className="p-2 border bg-transparent border-slate-600 rounded-md text-white" />
                                        <div className="flex items-center"><input type="text" name="frequency" placeholder="Frequency" value={med.frequency} onChange={e => handleMedicationChange(index, e)} className="p-2 border bg-transparent border-slate-600 rounded-md w-full text-white" /><button type="button" onClick={() => removeMedication(index)} className="ml-2 text-rose-500 hover:text-rose-700 p-1"><Trash2 size={16}/></button></div>
                                    </div>
                                ))}
                                <button type="button" onClick={addMedication} className="text-sm text-sky-500 hover:text-sky-400 font-semibold">+ Add Medication</button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
                <div className="flex justify-end pt-4 border-t border-slate-700">
                    <button type="button" onClick={onClose} className="bg-slate-700 border border-slate-600 text-slate-200 px-4 py-2 rounded-lg mr-2 hover:bg-slate-600">Cancel</button>
                    <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600" disabled={isUploading}>
                        {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : (record ? 'Update' : 'Save') + ' Record'}
                    </button>
                </div>
            </form>
        </ModalWrapper>
    );
};

export const ShareModal = ({ onClose, userId }) => {
    const [isCopied, setIsCopied] = useState(false);
    const shareableLink = `${window.location.origin}?shareId=${userId}`;
    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareableLink).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    return (
        <ModalWrapper onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-semibold text-center text-white">Share Your Portfolio</h2>
                <p className="text-slate-400 text-center mt-2 mb-4">Share this secure, read-only link with your doctor.</p>
                <div className="flex items-center space-x-2 bg-slate-700 p-3 rounded-lg">
                    <input type="text" value={shareableLink} readOnly className="flex-grow bg-transparent focus:outline-none text-sm font-mono text-slate-300" />
                    <button onClick={copyToClipboard} className="bg-sky-500 text-white px-3 py-1 rounded-md text-sm hover:bg-sky-600 flex items-center">
                        <Copy size={14} className="mr-1" />{isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export const DeleteConfirmModal = ({ onClose, onConfirm }) => (
    <ModalWrapper onClose={onClose}>
        <div className="p-6 text-center">
            <AlertTriangle size={48} className="mx-auto text-rose-500" />
            <h2 className="text-xl font-semibold mt-4 text-white">Are you sure?</h2>
            <p className="text-slate-400 mt-2">This action cannot be undone. All data for this record will be permanently deleted.</p>
            <div className="flex justify-center space-x-4 mt-6">
                <button onClick={onClose} className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white">Cancel</button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600">Delete</button>
            </div>
        </div>
    </ModalWrapper>
);
