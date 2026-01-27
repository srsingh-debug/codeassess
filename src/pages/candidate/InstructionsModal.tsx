import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { 
  Clock, 
  Code, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onContinue: () => void;
  assessmentData: {
    title: string;
    duration: number;
    allowedLanguages: string[];
    instructions: string[];
    rules: string[];
  };
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onContinue,
  assessmentData
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing without continuing
      title="Assessment Instructions"
      size="lg"
    >
      <div className="space-y-6">
        {/* Assessment overview */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            {assessmentData.title}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200">
                {assessmentData.duration} minutes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200">
                {assessmentData.allowedLanguages.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Instructions
          </h4>
          <div className="space-y-2">
            {assessmentData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded min-w-[24px] text-center">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {instruction}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rules and policies */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Rules & Policies
          </h4>
          <div className="space-y-2">
            {assessmentData.rules.map((rule, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Anti-Cheating Measures
              </h5>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• Tab switching will be detected and logged</li>
                <li>• Copy-paste activities are monitored</li>
                <li>• Screen recording may be enabled</li>
                <li>• Suspicious behavior will be flagged for review</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Acknowledgment and continue */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-start space-x-3 mb-4">
            <input
              type="checkbox"
              id="acknowledge"
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <label htmlFor="acknowledge" className="text-sm text-gray-700 dark:text-gray-300">
              I have read and understood all instructions, rules, and policies. 
              I agree to follow them throughout the assessment.
            </label>
          </div>
          
          <Button 
            onClick={onContinue}
            icon={ArrowRight}
            className="w-full"
            size="lg"
          >
            I Understand - Start Assessment
          </Button>
        </div>
      </div>
    </Modal>
  );
};