import React from "react";

const AdminSettingsPage = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl text-center">
                <div className="text-6xl mb-4">⚙️</div>
                <h3 className="text-xl font-bold text-white mb-2">System Settings</h3>
                <p className="text-slate-400">System settings configuration coming soon.</p>
                <p className="text-slate-500 text-sm mt-2">Platform management features will be available here.</p>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
