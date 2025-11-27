
import React, { useState } from 'react';
import InterviewSession from './components/InterviewSession';
import ApplicantForm from './components/ApplicantForm';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminPortal from './components/AdminPortal';
import ResumeReview from './components/ResumeReview';
import ApplicantResume from './components/ApplicantResume';
import { ApplicantData, AppStep } from './types';

function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [applicantData, setApplicantData] = useState<ApplicantData | null>(null);

  const handleFormSubmit = (data: ApplicantData) => {
    setApplicantData(data);
    // Skip ResumeReview, go straight to interview or confirmation
    // User requested: "do not display that in the front end anymode"
    // So we go directly to interview, but we keep the data for the /applicant-resume page
    setStep('interview'); 
  };

  const handleResumeConfirmed = () => {
    setStep('interview'); // Then go to iframe
  };

  const handleEndCall = () => {
    setStep('thank-you');
  };

  const handleStartOver = () => {
    setApplicantData(null);
    setStep('landing');
  };

  // --- ROUTING ---

  if (step === 'landing') {
      return (
          <LandingPage 
            onFindJob={() => setStep('applicant-form')}
            onAdminLogin={() => setStep('login')}
          />
      );
  }

  if (step === 'login') {
      return (
          <AdminLogin 
            onSuccess={() => setStep('admin')}
            onBack={() => setStep('landing')}
          />
      );
  }

  if (step === 'admin') {
      return (
          <AdminPortal 
            onLogout={() => setStep('landing')}
          />
      );
  }

  if (step === 'applicant-form') {
    return <ApplicantForm onSubmit={handleFormSubmit} onBack={() => setStep('landing')} />;
  }

  if (step === 'resume-review' && applicantData) {
      return (
          <ResumeReview 
            data={applicantData}
            onConfirm={handleResumeConfirmed}
            onBack={() => setStep('applicant-form')}
          />
      );
  }

  if (step === 'applicant-resume' && applicantData) {
      return (
          <ApplicantResume 
            data={applicantData}
            onBack={() => setStep('landing')}
          />
      );
  }

  // Active Interview - Direct Render (No Pre-check)
  if (step === 'interview' && applicantData) {
    return (
        <div className="h-screen w-screen overflow-hidden bg-black">
            <InterviewSession 
                onEndCall={handleEndCall} 
                applicantData={applicantData} 
                voiceName="Aoede" 
            />
        </div>
    );
  }

  if (step === 'thank-you') {
      return (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-center text-white">
              <div className="max-w-lg space-y-6">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="text-3xl font-bold">Interview Complete</h2>
                  <p className="text-gray-400 text-lg">Thank you, {applicantData?.name}. Beatrice has submitted your evaluation to the hiring team.</p>
                  <p className="text-gray-500">You will hear from us within 48 hours.</p>
                  <button onClick={handleStartOver} className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-full font-medium transition-colors">
                      Back to Home
                  </button>
              </div>
          </div>
      )
  }

  return null;
}

export default App;
