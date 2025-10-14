import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  percentage: number;
}

/**
 * Progress bar component showing wizard completion status
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, percentage }) => {
  return (
    <div className="w-full">
      {/* Step Info */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">
          Adım {currentStep} / {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          %{Math.round(percentage)} tamamlandı
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Profil tamamlanma: %${Math.round(percentage)}`}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index < currentStep
                ? 'bg-blue-600'
                : index === currentStep - 1
                ? 'bg-blue-400'
                : 'bg-gray-300'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;