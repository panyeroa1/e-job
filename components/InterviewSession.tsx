import React from 'react';
import { ApplicantData } from '../types';

interface InterviewSessionProps {
  onEndCall: () => void;
  applicantData: ApplicantData;
  voiceName: string;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ onEndCall, applicantData }) => {

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      <iframe
        src="https://eburon.ai/agents/index.html"
        className="absolute inset-0 w-full h-full border-none"
        allow="camera; microphone; autoplay; display-capture; fullscreen"
        title="Eburon AI Interviewer"
      />
      {/* Overlay controls removed as requested */}
    </div>
  );
};

export default InterviewSession;