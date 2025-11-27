import React from 'react';
import { ApplicantData } from '../types';

interface ApplicantResumeProps {
  data: ApplicantData;
  onBack: () => void;
}

const ApplicantResume: React.FC<ApplicantResumeProps> = ({ data, onBack }) => {
  if (!data) return <div className="text-white p-8">Loading or no data found...</div>;
  const resume = data.extractedResume || {};

  return (
    <div className="min-h-screen bg-gray-950 p-8 font-sans text-gray-300">
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">{data.name}</h1>
                <p className="text-emerald-400">{data.role}</p>
            </div>
            <button onClick={onBack} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                Back to Dashboard
            </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
                <div className="bg-gray-800/50 p-6 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span className="text-sm truncate" title={data.email}>{data.email}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {resume.skills?.map((skill: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs border border-blue-500/20">
                                {skill}
                            </span>
                        )) || <span className="text-gray-500 italic">No skills extracted</span>}
                    </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Education</h3>
                    <ul className="space-y-3 text-sm">
                        {resume.education?.map((edu: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                                <span>{edu}</span>
                            </li>
                        )) || <li className="text-gray-500 italic">No education listed</li>}
                    </ul>
                </div>
            </div>

            <div className="md:col-span-2 space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Professional Summary
                    </h2>
                    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-800">
                        <p className="leading-relaxed text-gray-300">
                            {resume.summary || data.experience || "No summary available."}
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Experience
                    </h2>
                    {/* If we had structured experience, we'd map it here. For now, we might just have the summary or unstructured text if the model didn't parse it perfectly into a list. 
                        The prompt asks for "Experience Summary", so we display that above. 
                        If the user wants full detailed experience, we'd need a more complex prompt/schema. 
                    */}
                    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-800">
                        <p className="text-gray-400 italic">
                            Detailed experience extraction is simplified in this view. Refer to the summary above.
                        </p>
                    </div>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantResume;
