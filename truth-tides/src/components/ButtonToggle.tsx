import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PreciseToggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <label className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className={`relative w-24 h-12 rounded-full flex items-center transition-colors duration-200 ease-in-out ${
        checked ? 'bg-green-400' : 'bg-gray-700'
      }`}>
        {/* ON text - shown only when toggle is on (checked) */}
        <div className={`absolute left-4 z-10 font-medium text-sm ${
          checked ? 'text-gray-800' : 'text-transparent'
        }`}>
          YES
        </div>
        
        {/* OFF text - shown only when toggle is off (!checked) */}
        <div className={`absolute right-4 z-10 font-medium text-sm ${
          !checked ? 'text-white' : 'text-transparent'
        }`}>
          NO
        </div>
        
        {/* Circle thumb that slides */}
        <div 
          className={`absolute w-10 h-10 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-12' : 'translate-x-1'
          }`} 
        />
      </div>
    </label>
  );
};

export default PreciseToggle;