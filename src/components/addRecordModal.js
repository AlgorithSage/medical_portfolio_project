import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// NOTE: Make sure you have initialized Firebase in your main App.js or a firebase.js config file
// import { app } from './firebase'; // Example import
// const storage = getStorage(app);
// const db = getFirestore(app);

const AddRecordModal = ({ closeModal, userId }) => {
    // Dummy Firebase instances for demonstration. Replace with your actual initialized instances.
    const storage = getStorage(); 
    const db = getFirestore();

    const [recordType, setRecordType] = useState('Prescription');
    const [date, setDate] = useState('');
    const [doctor, setDoctor] = useState('');
    const [details, setDetails] = useState('');
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        if (!userId) {
            setError('You must be logged in to upload records.');
            return;
        }

        setIsUploading(true);
        setError('');

        // 1. Create a storage reference
        // Unique path for each user and file: `records/{userId}/{timestamp}-{fileName}`
        const storageRef = ref(storage, `records/${userId}/${Date.now()}-${file.name}`);
        
        // 2. Start the upload task
        const uploadTask = uploadBytesResumable(storageRef, file);

        // 3. Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(Math.round(progress));
            }, 
            (error) => {
                // Handle unsuccessful uploads
                console.error("Upload failed:", error);
                setError('File upload failed. Please try again.');
                setIsUploading(false);
            }, 
            () => {
                // 4. Handle successful uploads on complete
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);

                    // 5. Save the record metadata (including the file URL) to Firestore
                    try {
                        await addDoc(collection(db, `users/${userId}/records`), {
                            recordType,
                            date,
                            doctor,
                            details,
                            fileUrl: downloadURL,
                            fileName: file.name,
                            createdAt: serverTimestamp()
                        });
                        
                        // Reset state and close modal
                        setIsUploading(false);
                        closeModal();

                    } catch (dbError) {
                        console.error("Error writing document to Firestore: ", dbError);
                        setError('Failed to save record. Please try again.');
                        setIsUploading(false);
                    }
                });
            }
        );
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl m-4 transform transition-all">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Medical Record</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <select value={recordType} onChange={e => setRecordType(e.target.value)} className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Prescription</option>
                            <option>Blood Test</option>
                            <option>X-Ray</option>
                            <option>ECG</option>
                            <option>Other</option>
                        </select>
                        <input type="text" placeholder="Doctor's Name" value={doctor} onChange={e => setDoctor(e.target.value)} required className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="Details / Diagnosis" value={details} onChange={e => setDetails(e.target.value)} className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file-upload">
                            Upload Document (PDF, IMG, etc.)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                {file && <p className="text-xs text-gray-500">{file.name}</p>}
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    
                    <div className="flex items-center justify-end space-x-4">
                        <button type="button" onClick={closeModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Cancel
                        </button>
                        <button type="submit" disabled={isUploading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300 disabled:cursor-not-allowed">
                            {isUploading ? `Uploading... ${uploadProgress}%` : 'Add Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRecordModal;
