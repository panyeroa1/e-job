
import React, { useState, useRef } from 'react';
import { ApplicantData } from '../types';
import { extractResumeData } from '../services/resumeExtractor';
import { saveApplicant } from '../services/supabase';
import { capturePhotoFromCamera, enhancePhoto } from '../services/photoEnhancer';

interface ApplicantFormProps {
  onSubmit: (data: ApplicantData) => void;
  onBack: () => void;
}

const ApplicantForm: React.FC<ApplicantFormProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    experience: '',
    resumeText: ''
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsExtracting(true);
      
      try {
        const data = await extractResumeData(file);
        setExtractedData(data);
        
        // Auto-fill form
        setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            role: data.role || prev.role,
            experience: data.summary || prev.experience,
            resumeText: JSON.stringify(data, null, 2) // Store full JSON as text for now
        }));
      } catch (error) {
        console.error("Extraction failed", error);
        // Fallback or error notification could go here
      } finally {
        setIsExtracting(false);
      }
    }
  };


  const handleTakePhoto = async () => {
    setIsCapturingPhoto(true);
    try {
      const rawPhoto = await capturePhotoFromCamera();
      const enhancedPhoto = await enhancePhoto(rawPhoto);
      setPhotoBase64(enhancedPhoto);
    } catch (error) {
      console.error('Photo capture error:', error);
      alert('Failed to capture photo. Please try again.');
    } finally {
      setIsCapturingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.role.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields (Name, Email, Role)');
      return;
    }
    
    // Require resume upload
    if (!fileName) {
      alert('Please upload your resume before submitting');
      return;
    }
    
    const applicantId = crypto.randomUUID();
    const newApplicant: ApplicantData = {
        id: applicantId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role.trim(),
        experience: formData.experience.trim(),
        resumeText: formData.resumeText.trim(),
        timestamp: Date.now(),
        extractedResume: extractedData,
        photoBase64: photoBase64 || undefined
    };

    // Save to Supabase
    await saveApplicant(newApplicant);
    
    // Proceed even if save fails (graceful degradation or local state only)
    onSubmit(newApplicant);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 animate-fade-in">
        
        <div className="flex justify-between items-start mb-10">
            <div>
                <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Start Your Journey</h2>
                <p className="text-gray-400">Tell us about yourself to begin the AI interview process.</p>
            </div>
            <div className="hidden md:block w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full opacity-80"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="e.g. jane@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-300">Target Position</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input
                  type="text"
                  id="role"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 outline-none transition-all"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Resume / CV</label>
            
            <div 
                onClick={() => !isExtracting && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group ${
                    fileName 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-gray-700 hover:border-emerald-500 hover:bg-gray-800/50'
                } ${isExtracting ? 'opacity-50 cursor-wait' : ''}`}
            >
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg"
                    className="hidden"
                    disabled={isExtracting}
                />
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    {isExtracting ? (
                        <svg className="w-6 h-6 text-emerald-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    )}
                </div>
                <p className="text-sm font-medium text-gray-300">
                    {isExtracting ? "Analyzing Resume..." : (fileName ? <span className="text-emerald-400">{fileName}</span> : "Click to upload resume")}
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOCX, TXT, Images (Max 5MB)</p>
            </div>
          </div>

          {/* Photo Capture Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Profile Photo (Optional)</label>
            
            <div className="flex flex-col items-center gap-4">
              {photoBase64 ? (
                <div className="relative">
                  <img 
                    src={`data:image/jpeg;base64,${photoBase64}`}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoBase64(null)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleTakePhoto}
                  disabled={isCapturingPhoto}
                  className="w-32 h-32 rounded-full bg-gray-800/50 border-2 border-dashed border-gray-700 hover:border-emerald-500 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isCapturingPhoto ? (
                    <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="text-xs text-gray-500">Take Photo</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-xs text-center text-gray-500">AI Enhanced Studio Portrait</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-300">Additional Experience Summary</label>
            <textarea
              id="experience"
              rows={3}
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-gray-500 outline-none transition-all resize-none"
              placeholder="Briefly describe your relevant experience..."
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
            />
          </div>

          <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-white text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.01] transition-all duration-200 text-lg flex items-center justify-center gap-2 group"
              >
                Proceed to Review
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
             <button onClick={onBack} className="text-sm text-gray-500 hover:text-white transition-colors">
                Cancel Application
            </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantForm;
