import React, { useState } from 'react';

type DisclaimerPopupProps = {
  onAccept: () => void;
};

const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ onAccept }) => {
  const [isChecked, setIsChecked] = useState(false); // State to track checkbox

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-xl font-bold mb-4 text-black">Disclaimer</h2>
        <p className="mb-4 text-black">
          This website is for informational purposes only. Please read and
          accept the terms and conditions to continue using the website.
        </p>
        <div className="flex items-center justify-center mb-6">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="mr-2"
          />
          <label htmlFor="acceptTerms" className="text-sm text-black">
            I have read and accept the terms and conditions
          </label>
        </div>
        <button
          onClick={onAccept}
          disabled={!isChecked} // Disable the button if the checkbox is not checked
          className={`${
            isChecked ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
          } text-white font-bold py-2 px-4 rounded border border-black`}
        >
          I Agree
        </button>
      </div>
    </div>
  );
};

export default DisclaimerPopup;
