
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import InterviewSession from './components/InterviewSession';
import ApplicantForm from './components/ApplicantForm';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminPortal from './components/AdminPortal';
import ResumeReview from './components/ResumeReview';
import ApplicantResume from './components/ApplicantResume';
import { ApplicantData, AppStep } from './types';
import { getApplicant } from './services/supabase';

function AppContent() {
  const [applicantData, setApplicantData] = useState<ApplicantData | null>(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (data: ApplicantData) => {
    setApplicantData(data);
    // Store current applicant ID in localStorage for /applicant-resume access
    localStorage.setItem('currentApplicantId', data.id);
    navigate('/interview');
  };

  const handleResumeConfirmed = () => {
    navigate('/interview');
  };

  const handleEndCall = () => {
    navigate('/thank-you');
  };

  const handleStartOver = () => {
    setApplicantData(null);
    localStorage.removeItem('currentApplicantId');
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={
        <LandingPage 
          onFindJob={() => navigate('/application')}
          onAdminLogin={() => navigate('/admin/login')}
        />
      } />
      
      <Route path="/application" element={
        <ApplicantForm 
          onSubmit={handleFormSubmit} 
          onBack={() => navigate('/')} 
        />
      } />

      <Route path="/resume-review" element={
        applicantData ? (
          <ResumeReview 
            data={applicantData}
            onConfirm={handleResumeConfirmed}
            onBack={() => navigate('/application')}
          />
        ) : (
          <Navigate to="/application" replace />
        )
      } />

      <Route path="/applicant-resume" element={
        <ApplicantResumePage onBack={() => navigate('/')} />
      } />

      <Route path="/interview" element={
        applicantData ? (
          <div className="h-screen w-screen overflow-hidden bg-black">
            <InterviewSession 
              onEndCall={handleEndCall} 
              applicantData={applicantData} 
              voiceName="Aoede" 
            />
          </div>
        ) : (
          <Navigate to="/application" replace />
        )
      } />

      <Route path="/thank-you" element={
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
      } />

      <Route path="/admin/login" element={
        <AdminLogin 
          onSuccess={() => navigate('/admin/portal')}
          onBack={() => navigate('/')}
        />
      } />

      <Route path="/admin/portal" element={
        <AdminPortal onLogout={() => navigate('/')} />
      } />
    </Routes>
  );
}

// Separate component to handle /applicant-resume fetching
function ApplicantResumePage({ onBack }: { onBack: () => void }) {
  const [applicantData, setApplicantData] = React.useState<ApplicantData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadApplicant = async () => {
      // Get current applicant ID from localStorage
      const currentId = localStorage.getItem('currentApplicantId');
      if (currentId) {
        const data = await getApplicant(currentId);
        setApplicantData(data);
      }
      setLoading(false);
    };
    loadApplicant();
  }, []);

  if (loading) {
    return <div className="text-white p-8 min-h-screen bg-gray-950 flex items-center justify-center">Loading...</div>;
  }

  if (!applicantData) {
    return (
      <div className="text-white p-8 min-h-screen bg-gray-950 flex items-center justify-center flex-col gap-4">
        <p>No applicant data found.</p>
        <button onClick={onBack} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
          Back to Home
        </button>
      </div>
    );
  }

  return <ApplicantResume data={applicantData} onBack={onBack} />;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
