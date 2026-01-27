import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { 
  Link, 
  Copy,
  Send,
  Users,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  Mail,
  ExternalLink,
  Share
} from 'lucide-react';

interface SendAssessmentLinkProps {
  onNavigate: (view: string) => void;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  status: string;
}

interface Assessment {
  id: string;
  title: string;
  duration: number;
  questionCount: number;
  description: string;
}

// Mock data
const mockCandidates: Candidate[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', position: 'Frontend Developer', status: 'not_started' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', position: 'Backend Developer', status: 'invited' },
  { id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com', position: 'Full Stack Developer', status: 'completed' }
];

const mockAssessments: Assessment[] = [
  { id: '1', title: 'Frontend Developer Test', duration: 90, questionCount: 5, description: 'React and JavaScript assessment' },
  { id: '2', title: 'Backend Developer Assessment', duration: 120, questionCount: 7, description: 'Python and algorithms' },
  { id: '3', title: 'Full Stack Challenge', duration: 150, questionCount: 10, description: 'Comprehensive full-stack evaluation' }
];

export const SendAssessmentLink: React.FC<SendAssessmentLinkProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [generatedLinks, setGeneratedLinks] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    sendEmail: true,
    customMessage: '',
    deadline: ''
  });

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const generateLinks = () => {
    if (!selectedAssessment || selectedCandidates.length === 0) return;

    const links: Record<string, string> = {};
    selectedCandidates.forEach(candidateId => {
      // Generate unique secure link for each candidate
      const token = btoa(`${selectedAssessment}-${candidateId}-${Date.now()}`);
      links[candidateId] = `https://assessment.codeassess.com/take/${token}`;
    });
    
    setGeneratedLinks(links);
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  const copyAllLinks = () => {
    const allLinks = Object.values(generatedLinks).join('\n');
    navigator.clipboard.writeText(allLinks);
  };

  const handleSendInvites = () => {
    // Logic to send email invitations
    console.log('Sending invites:', {
      assessment: selectedAssessment,
      candidates: selectedCandidates,
      links: generatedLinks,
      emailSettings
    });
    
    setShowConfirmModal(false);
    // Reset form or show success message
  };

  const selectedAssessmentData = mockAssessments.find(a => a.id === selectedAssessment);

  return (<>
    <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Send Assessment Links
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Generate and send assessment links to selected candidates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Assessment Selection */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Select Assessment
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAssessments.map((assessment) => (
                      <div 
                        key={assessment.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedAssessment === assessment.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setSelectedAssessment(assessment.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            checked={selectedAssessment === assessment.id}
                            onChange={() => setSelectedAssessment(assessment.id)}
                            className="mt-1 w-4 h-4 text-blue-600"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                              {assessment.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {assessment.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{assessment.duration} min</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="w-4 h-4" />
                                <span>{assessment.questionCount} questions</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Email Settings */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Email Settings
                  </h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="sendEmail"
                      checked={emailSettings.sendEmail}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, sendEmail: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="sendEmail" className="text-sm text-gray-700 dark:text-gray-300">
                      Send email invitations automatically
                    </label>
                  </div>
                  
                  <Input
                    label="Assessment Deadline (Optional)"
                    type="datetime-local"
                    value={emailSettings.deadline}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Custom Message (Optional)
                    </label>
                    <textarea
                      value={emailSettings.customMessage}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, customMessage: e.target.value }))}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Add a personal message to the invitation email..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Candidate Selection */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Select Candidates
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedCandidates.length} selected
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {mockCandidates.map((candidate) => (
                      <div 
                        key={candidate.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                          selectedCandidates.includes(candidate.id)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleCandidateToggle(candidate.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedCandidates.includes(candidate.id)}
                            onChange={() => handleCandidateToggle(candidate.id)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {candidate.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {candidate.email} • {candidate.position}
                            </div>
                          </div>
                          <Badge variant={candidate.status === 'completed' ? 'success' : 'default'}>
                            {candidate.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Generate Links Section */}
          <div>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Assessment Links
                </h2>
              </CardHeader>
              <CardContent>
                {Object.keys(generatedLinks).length === 0 ? (
                  <div className="text-center py-8">
                    <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Generate unique assessment links for selected candidates
                    </p>
                    <Button 
                      onClick={generateLinks}
                      disabled={!selectedAssessment || selectedCandidates.length === 0}
                      icon={Link}
                    >
                      Generate Links
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Generated Links ({Object.keys(generatedLinks).length})
                      </h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" icon={Copy} onClick={copyAllLinks}>
                          Copy All
                        </Button>
                        <Button 
                          size="sm" 
                          icon={Send}
                          onClick={() => setShowConfirmModal(true)}
                          disabled={!emailSettings.sendEmail}
                        >
                          Send Invites
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(generatedLinks).map(([candidateId, link]) => {
                        const candidate = mockCandidates.find(c => c.id === candidateId);
                        if (!candidate) return null;
                        
                        return (
                          <div key={candidateId} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {candidate.name}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                  {candidate.email}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  icon={Copy}
                                  onClick={() => copyLink(link)}
                                >
                                  Copy
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  icon={ExternalLink}
                                  onClick={() => window.open(link, '_blank')}
                                >
                                  Open
                                </Button>
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                              <code className="text-xs text-gray-600 dark:text-gray-300 break-all">
                                {link}
                              </code>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Confirmation Modal */}
          <Modal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            title="Confirm Send Invitations"
            size="md"
          >
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Invitation Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Assessment:</span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">
                      {selectedAssessmentData?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Recipients:</span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">
                      {selectedCandidates.length} candidates
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700 dark:text-blue-300">Duration:</span>
                    <span className="text-blue-900 dark:text-blue-100 font-medium">
                      {selectedAssessmentData?.duration} minutes
                    </span>
                  </div>
                  {emailSettings.deadline && (
                    <div className="flex justify-between">
                      <span className="text-blue-700 dark:text-blue-300">Deadline:</span>
                      <span className="text-blue-900 dark:text-blue-100 font-medium">
                        {new Date(emailSettings.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recipients List */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Email Recipients
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-32 overflow-y-auto">
                  {selectedCandidates.map(id => {
                    const candidate = mockCandidates.find(c => c.id === id);
                    return candidate ? (
                      <div key={id} className="flex items-center justify-between py-1">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {candidate.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {candidate.email}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Custom Message Preview */}
              {emailSettings.customMessage && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Custom Message
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {emailSettings.customMessage}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                  Cancel
                </Button>
                <Button icon={Send} onClick={handleSendInvites}>
                  Send {selectedCandidates.length} Invitation{selectedCandidates.length > 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
  
    </>
  );
};