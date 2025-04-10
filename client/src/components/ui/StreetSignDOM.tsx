import React from 'react';
import { useStreetSign } from "../../lib/stores/useStreetSign";
import { useAudio } from "../../lib/stores/useAudio";

/**
 * A DOM-based street sign that's completely independent of the 3D scene
 * This will always stay fixed in the same position regardless of character rotation or movement
 */
const StreetSignDOM = () => {
  const { openAboutInfo } = useStreetSign();
  const { playHit } = useAudio();
  
  const handleClick = () => {
    openAboutInfo();
    playHit();
  };

  return (
    <div 
      className="fixed top-5 left-1/2 transform -translate-x-1/2 cursor-pointer z-50"
      onClick={handleClick}
    >
      <div className="relative w-[340px] h-[180px] bg-blue-800 border-4 border-white rounded-lg shadow-lg overflow-hidden hover:bg-blue-700 transition-colors">
        {/* Sign content */}
        <div className="absolute inset-0 flex flex-col items-center justify-between p-3 text-center">
          {/* Header */}
          <h2 className="text-yellow-300 font-bold text-xl mt-1">
            MICHAEL R. SMITH
          </h2>
          
          {/* Subheader */}
          <h3 className="text-yellow-300 font-bold text-lg -mt-2">
            PORTFOLIO STREET
          </h3>
          
          {/* Bottom text */}
          <div className="bg-blue-900 border-2 border-white w-full py-2 rounded hover:bg-blue-800">
            <p className="text-yellow-300 font-bold text-md">
              CLICK FOR INFO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreetSignDOM;