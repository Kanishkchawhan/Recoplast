import React from "react";
import UploadForm from "../components/UploadForm";
import UploadsList from "../components/UploadsList";

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Upload Plastic Waste</h1>
        <UploadForm />
      </div>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-4 text-center">Your Previous Uploads</h2>
        <UploadsList />
      </div>
    </div>
  );
};

export default UploadPage;
