/**
 * @file DisclaimerPage.tsx
 * @description A React component that displays a disclaimer page with animated particle effects
 * @maintainers 
 * - Oisin Aeonn (s3952320@student.rmit.edu.au)
 * - Jasica Jong (s3805999@student.rmit.edu.au)
 * - Lucas Phung (s3945217@student.rmit.edu.au)
 */

import React, { useState } from 'react';
import { ParticleEffect } from './components/ParticleEffect/ParticleEffect';

/**
 * Props interface for the DisclaimerPage component
 * @interface DisclaimerPageProps
 * @property {() => void} onAccept - Callback function executed when user accepts terms
 */
interface DisclaimerPageProps {
  onAccept: () => void;
}

/**
 * DisclaimerPage component that displays terms and conditions with an interactive
 * particle effect background using Three.js
 */
const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onAccept }) => {
  // State management for user interactions and animation control
  const [isChecked, setIsChecked] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  // Handle user acceptance of terms
  const handleAccept = () => {
    setIsChecked(true);
    setTimeout(() => {
      setIsExploding(true);
      setTimeout(onAccept, 5000);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-4 relative">
      {/* Particle Effect Background */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <ParticleEffect isExploding={isExploding} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-start w-full max-w-4xl mx-auto">
        {/* Warning Banner */}
        <div className="bg-red-600 text-white p-4 rounded-lg w-full text-center mt-8">
          <strong className="font-bold">Photosensitivity Warning:</strong>
          <span className="ml-2">This page contains moving particles and lights. Viewer discretion is advised.</span>
        </div>

        {/* Three.js Container */}
        <div className="w-full h-64 my-20" />

        {/* Main Content */}
        <h1 className="text-4xl font-bold mb-12 mt-20">Disclaimer</h1>
        <p className="text-center mb-16 text-lg leading-relaxed px-4">
          The content on The Zone represents an artistic exploration of the flow of news and media 
          in the 21st century, using advanced Deep Learning techniques to classify and analyze 
          articles across various topics. While every effort has been made to use technology to 
          gain insights and organize information, these methods are not infallible. Visitors should 
          approach the content with critical thinking and caution.
        </p>

        {/* Terms Acceptance */}
        <div className="flex items-center gap-3 mb-12">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="w-5 h-5 rounded border-gray-300 text-white focus:ring-white"
          />
          <label className="text-lg">
            I have read and accept the terms and conditions
          </label>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAccept}
          disabled={!isChecked || isExploding}
          className={`
            px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 mb-16
            ${isChecked && !isExploding 
              ? 'bg-white text-black hover:bg-gray-200 hover:scale-105' 
              : 'bg-gray-500 cursor-not-allowed opacity-50'
            }
          `}
        >
          {isExploding ? 'Entering The Zone...' : 'Enter The Zone'}
        </button>
      </div>
    </div>
  );
};

export default DisclaimerPage;