
import React from 'react';
import { ApplicantData } from '../types';

interface ResumeReviewProps {
  data: ApplicantData;
  onConfirm: () => void;
  onBack: () => void;
}

const ResumeReview: React.FC<ResumeReviewProps> = ({ data, onConfirm, onBack }) => {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono flex flex-col items-center">
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        
        {/* Left Column: JSON Data Viewer */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-emerald-400 uppercase tracking-widest">Applicant Data (JSON)</h2>
                <div className="text-xs text-gray-500">ReadOnly Preview</div>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl overflow-hidden relative group h-[calc(100vh-200px)]">
                <div className="absolute top-0 right-0 p-2 opacity-50 text-xs text-gray-600 font-bold select-none">JSON</div>
                <pre className="text-xs md:text-sm text-green-300 whitespace-pre-wrap break-all overflow-y-auto h-full custom-scrollbar">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </div>

        {/* Right Column: Resume Content Preview */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-blue-400 uppercase tracking-widest">Extracted Resume Content</h2>
                <div className="text-xs text-gray-500">Text View</div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl overflow-hidden relative group h-[calc(100vh-200px)] flex flex-col">
                <div className="absolute top-0 right-0 p-2 opacity-50 text-xs text-gray-600 font-bold select-none">TXT</div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {data.resumeText || "No resume text content available."}
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gray-900/80 backdrop-blur-md border-t border-gray-800 p-6 flex justify-center gap-6 z-20">
            <button 
                onClick={onBack}
                className="px-8 py-3 rounded-full border border-gray-700 hover:bg-gray-800 text-gray-300 font-bold transition-colors"
            >
                Back to Edit
            </button>
            <button 
                onClick={onConfirm}
                className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
                Confirm & Start Interview
            </button>
      </div>
    </div>
  );
};

export default ResumeReview;
