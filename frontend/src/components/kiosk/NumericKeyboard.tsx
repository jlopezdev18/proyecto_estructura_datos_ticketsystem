import React from 'react';
import { Delete, ArrowLeft } from 'lucide-react';

interface NumericKeypadProps {
  onNumberPress: (number: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onNumberPress,
  onBackspace,
  onClear,
}) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
      {numbers.slice(0, 9).map((number) => (
        <button
          key={number}
          onClick={() => onNumberPress(number)}
          className="bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 
                   rounded-xl p-6 text-2xl font-bold text-blue-900 shadow-lg
                   active:scale-95 transition-all duration-150 min-h-[80px]
                   touch-manipulation select-none"
        >
          {number}
        </button>
      ))}
      
      <button
        onClick={onClear}
        className="bg-red-500 hover:bg-red-600 rounded-xl p-6 text-white font-bold shadow-lg
                 active:scale-95 transition-all duration-150 min-h-[80px]
                 touch-manipulation select-none flex items-center justify-center"
      >
        <Delete className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => onNumberPress('0')}
        className="bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 
                 rounded-xl p-6 text-2xl font-bold text-blue-900 shadow-lg
                 active:scale-95 transition-all duration-150 min-h-[80px]
                 touch-manipulation select-none"
      >
        0
      </button>
      
      <button
        onClick={onBackspace}
        className="bg-orange-500 hover:bg-orange-600 rounded-xl p-6 text-white font-bold shadow-lg
                 active:scale-95 transition-all duration-150 min-h-[80px]
                 touch-manipulation select-none flex items-center justify-center"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
    </div>
  );
};