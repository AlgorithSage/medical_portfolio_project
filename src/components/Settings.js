import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => (
    <div className="p-8 h-screen text-white">
        <div className="flex items-center gap-4">
            <SettingsIcon size={32} className="text-slate-400" />
            <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="mt-4 text-slate-400">Manage your account details, preferences, and notification settings on this page.</p>
    </div>
);

export default Settings;