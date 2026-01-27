import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { 
  Plus, 
  Search,
  Filter,
  Upload,
  Wand2,
  Download,
  Save,
  Eye,
  Trash2,
  Code,
  FileText,
  Clock,
  Settings,
  CheckCircle,
  AlertTriangle,
  X,
  Send,
  ArrowLeft,
  Copy,
  Mail
} from 'lucide-react';

interface AssessmentCreationProps {
  onNavigate: (view: string) => void;
}

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  topic: string;
  points: number;
  starterCode: string;
  testCases: Array<{
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }>;
}

// Mock question store data
const mockQuestionStore: Question[] = [
  {
    id: '1',
    title: 'Two Sum Problem',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'easy',
    language: 'javascript',
    topic: 'arrays',
    points: 10,
    starterCode: 'function twoSum(nums, target) {\n  // Your code here\n  return [];\n}',
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: true }
    ]
  },
  {
    id: '2',
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    difficulty: 'medium',
    language: 'python',
    topic: 'strings',
    points: 15,
    starterCode: 'def isValid(s):\n    # Your code here\n    return False',
    testCases: [
      { input: '"()[]{}"', expectedOutput: 'true', isHidden: false }
    ]
  },
  {
    id: '3',
    title: 'Binary Tree Inorder Traversal',
    description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
    difficulty: 'hard',
    language: 'java',
    topic: 'trees',
    points: 25,
    starterCode: 'public List<Integer> inorderTraversal(TreeNode root) {\n    // Your code here\n    return new ArrayList<>();\n}',
    testCases: [
      { input: '[1,null,2,3]', expectedOutput: '[1,3,2]', isHidden: false }
    ]
  }
];

export const AssessmentCreation: React.FC<AssessmentCreationProps> = ({ onNavigate }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [savedAssessment, setSavedAssessment] = useState<any>(null);
  const [assessmentLink, setAssessmentLink] = useState('');
  const [emailForm, setEmailForm] = useState({
    recipients: '',
    subject: 'Coding Assessment Invitation',
    message: 'You have been invited to complete a coding assessment. Please click the link below to begin.',
    deadline: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [creationMode, setCreationMode] = useState<'select' | 'import' | 'previous' | 'ai'>('select');
  const [assessmentData, setAssessmentData] = useState({
    title: '',
    description: '',
    duration: 60,
    allowedLanguages: [] as string[],
    plagiarismDetection: true,
    tabSwitchDetection: true
  });

  // Question selection state
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');

  // JSON import state
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [importedQuestions, setImportedQuestions] = useState<Question[]>([]);

  // Previous assessments state
  const [previousAssessments, setPreviousAssessments] = useState<any[]>([]);
  const [selectedPreviousAssessment, setSelectedPreviousAssessment] = useState('');

  // AI generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [aiError, setAiError] = useState('');
  const [difficultySelection, setDifficultySelection] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  });

  // Modal states
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showJsonHelpModal, setShowJsonHelpModal] = useState(false);
  const [showAiHelpModal, setShowAiHelpModal] = useState(false);

  // Mock previous assessments data
  const mockPreviousAssessments = [
    {
      id: '1',
      title: 'Frontend Developer Test - React Focus',
      createdAt: new Date('2024-01-15'),
      candidatesCount: 25,
      averageScore: 78.5,
      questions: mockQuestionStore.slice(0, 3)
    },
    {
      id: '2',
      title: 'Backend Developer Assessment - Python',
      createdAt: new Date('2024-01-10'),
      candidatesCount: 18,
      averageScore: 82.3,
      questions: mockQuestionStore.slice(1, 4)
    }
  ];

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  const difficultyOptions = [
    { value: '', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const topicOptions = [
    { value: '', label: 'All Topics' },
    { value: 'arrays', label: 'Arrays' },
    { value: 'strings', label: 'Strings' },
    { value: 'trees', label: 'Trees' },
    { value: 'graphs', label: 'Graphs' },
    { value: 'dynamic-programming', label: 'Dynamic Programming' }
  ];

  // Filter questions based on search and filters
  const filteredQuestions = mockQuestionStore.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = !languageFilter || question.language === languageFilter;
    const matchesDifficulty = !difficultyFilter || question.difficulty === difficultyFilter;
    const matchesTopic = !topicFilter || question.topic === topicFilter;
    
    return matchesSearch && matchesLanguage && matchesDifficulty && matchesTopic;
  });

  const handleLanguageToggle = (language: string) => {
    setAssessmentData(prev => ({
      ...prev,
      allowedLanguages: prev.allowedLanguages.includes(language)
        ? prev.allowedLanguages.filter(l => l !== language)
        : [...prev.allowedLanguages, language]
    }));
  };

  const handleQuestionToggle = (question: Question) => {
    setSelectedQuestions(prev => {
      const isSelected = prev.some(q => q.id === question.id);
      if (isSelected) {
        return prev.filter(q => q.id !== question.id);
      } else {
        return [...prev, question];
      }
    });
  };

  const handleJsonImport = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      
      // Validate JSON structure
      if (!Array.isArray(parsed.questions)) {
        throw new Error('JSON must contain a "questions" array');
      }

      // Validate each question
      const validatedQuestions = parsed.questions.map((q: any, index: number) => {
        if (!q.title || !q.description || !q.difficulty || !q.language) {
          throw new Error(`Question ${index + 1} is missing required fields`);
        }
        return {
          id: q.id || `imported-${Date.now()}-${index}`,
          title: q.title,
          description: q.description,
          difficulty: q.difficulty,
          language: q.language,
          topic: q.topic || 'general',
          points: q.points || 10,
          starterCode: q.starterCode || '',
          testCases: q.testCases || []
        };
      });

      setImportedQuestions(validatedQuestions);
      setJsonError('');
      
      // Update assessment metadata if provided
      if (parsed.title) setAssessmentData(prev => ({ ...prev, title: parsed.title }));
      if (parsed.description) setAssessmentData(prev => ({ ...prev, description: parsed.description }));
      if (parsed.duration) setAssessmentData(prev => ({ ...prev, duration: parsed.duration }));
      
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON format');
      setImportedQuestions([]);
    }
  };

  const handleAiGeneration = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Please provide a prompt for AI generation');
      return;
    }

    setIsGenerating(true);
    setAiError('');

    try {
      // Simulate API call to backend for AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated questions based on difficulty selection
      const mockGeneratedQuestions: Question[] = [];
      let questionId = 100;

      // Generate easy questions
      for (let i = 0; i < difficultySelection.easy; i++) {
        mockGeneratedQuestions.push({
          id: `ai-${questionId++}`,
          title: `AI Generated Easy Question ${i + 1}`,
          description: `This is an AI-generated easy coding question based on your prompt: "${aiPrompt.substring(0, 50)}..."`,
          difficulty: 'easy',
          language: assessmentData.allowedLanguages[0] || 'javascript',
          topic: 'ai-generated',
          points: 10,
          starterCode: 'function solution() {\n  // Your code here\n}',
          testCases: [
            { input: 'sample input', expectedOutput: 'expected output', isHidden: false }
          ]
        });
      }

      // Generate medium questions
      for (let i = 0; i < difficultySelection.medium; i++) {
        mockGeneratedQuestions.push({
          id: `ai-${questionId++}`,
          title: `AI Generated Medium Question ${i + 1}`,
          description: `This is an AI-generated medium coding question based on your prompt: "${aiPrompt.substring(0, 50)}..."`,
          difficulty: 'medium',
          language: assessmentData.allowedLanguages[0] || 'javascript',
          topic: 'ai-generated',
          points: 15,
          starterCode: 'function solution() {\n  // Your code here\n}',
          testCases: [
            { input: 'sample input', expectedOutput: 'expected output', isHidden: false }
          ]
        });
      }

      // Generate hard questions
      for (let i = 0; i < difficultySelection.hard; i++) {
        mockGeneratedQuestions.push({
          id: `ai-${questionId++}`,
          title: `AI Generated Hard Question ${i + 1}`,
          description: `This is an AI-generated hard coding question based on your prompt: "${aiPrompt.substring(0, 50)}..."`,
          difficulty: 'hard',
          language: assessmentData.allowedLanguages[0] || 'javascript',
          topic: 'ai-generated',
          points: 25,
          starterCode: 'function solution() {\n  // Your code here\n}',
          testCases: [
            { input: 'sample input', expectedOutput: 'expected output', isHidden: false }
          ]
        });
      }

      setGeneratedQuestions(mockGeneratedQuestions);
    } catch (error) {
      setAiError('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviousAssessmentSelect = (assessmentId: string) => {
    const assessment = mockPreviousAssessments.find(a => a.id === assessmentId);
    if (assessment) {
      setSelectedPreviousAssessment(assessmentId);
      // Auto-populate assessment data
      setAssessmentData(prev => ({
        ...prev,
        title: `${assessment.title} (Copy)`,
        description: `Based on previous assessment with ${assessment.candidatesCount} candidates and ${assessment.averageScore}% average score`
      }));
    }
  };

  const handleSaveAssessment = () => {
    let questionsToSave: Question[] = [];
    
    switch (creationMode) {
      case 'select':
        questionsToSave = selectedQuestions;
        break;
      case 'import':
        questionsToSave = importedQuestions;
        break;
      case 'previous':
        const prevAssessment = mockPreviousAssessments.find(a => a.id === selectedPreviousAssessment);
        questionsToSave = prevAssessment?.questions || [];
        break;
      case 'ai':
        questionsToSave = generatedQuestions;
        break;
    }
    
    if (!assessmentData.title || questionsToSave.length === 0) {
      alert('Please provide assessment title and select at least one question');
      return;
    }

    const assessment = {
      id: Date.now().toString(),
      ...assessmentData,
      questions: questionsToSave,
      createdAt: new Date(),
      status: 'published'
    };
    
    setSavedAssessment(assessment);
    // Generate unique assessment link
    const token = btoa(`${assessment.id}-${Date.now()}`);
    setAssessmentLink(`https://assessment.codeassess.com/take/${token}`);
    setShowPreview(false);
    setShowSendModal(true);
  };

  const handleSendEmails = async () => {
    setIsSending(true);
    
    // Simulate sending emails
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Sending assessment emails:', {
      assessment: savedAssessment,
      link: assessmentLink,
      emailData: emailForm
    });
    
    setIsSending(false);
    setShowSendModal(false);
    
    // Reset form or show success message
    alert('Assessment created and invitations sent successfully!');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(assessmentLink);
    // You could add a toast notification here
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'default';
    }
  };

  const sampleJsonFormat = {
    title: "Sample Assessment",
    description: "A sample coding assessment",
    duration: 90,
    questions: [
      {
        title: "Array Sum",
        description: "Calculate the sum of array elements",
        difficulty: "easy",
        language: "javascript",
        topic: "arrays",
        points: 10,
        starterCode: "function arraySum(arr) {\n  // Your code here\n}",
        testCases: [
          {
            input: "[1, 2, 3, 4, 5]",
            expectedOutput: "15",
            isHidden: false
          }
        ]
      }
    ]
  };

  // Assessment Preview Modal
  const AssessmentPreview = () => (
    <Modal
      isOpen={showPreview}
      onClose={() => setShowPreview(false)}
      title="Assessment Preview"
      size="xl"
    >
      <div className="space-y-6">
        {/* Assessment Overview */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
            {assessmentData.title}
          </h3>
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            {assessmentData.description}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200">
                {assessmentData.duration} minutes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200">
                {selectedQuestions.length} questions
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200">
                {assessmentData.allowedLanguages.join(', ')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200">
                {assessmentData.plagiarismDetection ? 'Secure' : 'Standard'}
              </span>
            </div>
          </div>
        </div>

        {/* Questions Preview */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Questions ({selectedQuestions.length})
          </h4>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedQuestions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded">
                      Q{index + 1}
                    </span>
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {question.title}
                    </h5>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      question.difficulty === 'easy' ? 'success' :
                      question.difficulty === 'medium' ? 'warning' : 'danger'
                    }>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="info">{question.language}</Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {question.points} pts
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  {question.description}
                </p>
                
                {question.starterCode && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Starter Code:</p>
                    <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                      {question.starterCode}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            icon={ArrowLeft}
            onClick={() => setShowPreview(false)}
          >
            Back to Edit
          </Button>
          <Button 
            icon={Save}
            onClick={handleSaveAssessment}
          >
            Save & Send Assessment
          </Button>
        </div>
      </div>
    </Modal>
  );

  // Send Assessment Modal
  const SendAssessmentModal = () => (
    <Modal
      isOpen={showSendModal}
      onClose={() => setShowSendModal(false)}
      title="Send Assessment to Candidates"
      size="lg"
    >
      <div className="space-y-6">
        {/* Assessment Link */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Assessment Link
          </h4>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                {assessmentLink}
              </code>
            </div>
            <Button variant="outline" size="sm" icon={Copy} onClick={copyLink}>
              Copy
            </Button>
          </div>
        </div>

        {/* Email Form */}
        <div className="space-y-4">
          <Input
            label="Recipients (comma-separated emails)"
            placeholder="candidate1@example.com, candidate2@example.com"
            value={emailForm.recipients}
            onChange={(e) => setEmailForm(prev => ({ ...prev, recipients: e.target.value }))}
          />
          
          <Input
            label="Subject"
            value={emailForm.subject}
            onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={emailForm.message}
              onChange={(e) => setEmailForm(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Enter your invitation message..."
            />
          </div>
          
          <Input
            label="Deadline (Optional)"
            type="datetime-local"
            value={emailForm.deadline}
            onChange={(e) => setEmailForm(prev => ({ ...prev, deadline: e.target.value }))}
          />
        </div>

        {/* Email Preview */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Email Preview</h5>
          <div className="text-sm space-y-2">
            <div><strong>Subject:</strong> {emailForm.subject}</div>
            <div><strong>Message:</strong></div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded border">
              <p className="whitespace-pre-wrap">{emailForm.message}</p>
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="text-blue-800 dark:text-blue-200 font-medium">Assessment Details:</p>
                <p className="text-blue-700 dark:text-blue-300">• {savedAssessment?.title}</p>
                <p className="text-blue-700 dark:text-blue-300">• Duration: {savedAssessment?.duration} minutes</p>
                <p className="text-blue-700 dark:text-blue-300">• Questions: {selectedQuestions.length}</p>
                {emailForm.deadline && (
                  <p className="text-blue-700 dark:text-blue-300">• Deadline: {new Date(emailForm.deadline).toLocaleString()}</p>
                )}
                <div className="mt-2">
                  <a href={assessmentLink} className="text-blue-600 dark:text-blue-400 underline">
                    Start Assessment
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => setShowSendModal(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button 
            icon={Send}
            onClick={handleSendEmails}
            loading={isSending}
            disabled={!emailForm.recipients || isSending}
          >
            {isSending ? 'Sending...' : 'Send Invitations'}
          </Button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-6">
        {/* Assessment Details */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Assessment Details
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Assessment Title"
                placeholder="e.g., Frontend Developer Test"
                value={assessmentData.title}
                onChange={(e) => setAssessmentData(prev => ({ ...prev, title: e.target.value }))}
              />
              
              <Input
                label="Duration (minutes)"
                type="number"
                value={assessmentData.duration}
                onChange={(e) => setAssessmentData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              />
            </div>
            
            <Textarea
              label="Description"
              placeholder="Describe the assessment purpose and what candidates should expect..."
              rows={3}
              value={assessmentData.description}
              onChange={(e) => setAssessmentData(prev => ({ ...prev, description: e.target.value }))}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Allowed Programming Languages
              </label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleLanguageToggle(lang.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      assessmentData.allowedLanguages.includes(lang.value)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="plagiarism"
                  checked={assessmentData.plagiarismDetection}
                  onChange={(e) => setAssessmentData(prev => ({ ...prev, plagiarismDetection: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="plagiarism" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable plagiarism detection
                </label>
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="tabSwitch"
                  checked={assessmentData.tabSwitchDetection}
                  onChange={(e) => setAssessmentData(prev => ({ ...prev, tabSwitchDetection: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="tabSwitch" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable tab-switching alerts
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creation Mode Toggle */}
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8 gap-1">
          <button
            onClick={() => setCreationMode('select')}
            className={`px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
              creationMode === 'select'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
          >
            Question Store
          </button>
          <button
            onClick={() => setCreationMode('import')}
            className={`px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
              creationMode === 'import'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
          >
            Import JSON
          </button>
          <button
            onClick={() => setCreationMode('previous')}
            className={`px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
              creationMode === 'previous'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
          >
            Previous Tests
          </button>
          <button
            onClick={() => setCreationMode('ai')}
            className={`px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
              creationMode === 'ai'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
            }`}
          >
            AI Generate
          </button>
        </div>

        {/* Question Selection Mode */}
        {creationMode === 'select' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Question Store */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Question Store ({filteredQuestions.length})
                    </h3>
                    <Button variant="outline" size="sm">
                      Add New Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search and Filters */}
                  <div className="space-y-4 mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                        options={languageOptions}
                        value={languageFilter}
                        onChange={setLanguageFilter}
                        placeholder="Filter by language"
                      />
                      <Select
                        options={difficultyOptions}
                        value={difficultyFilter}
                        onChange={setDifficultyFilter}
                        placeholder="Filter by difficulty"
                      />
                      <Select
                        options={topicOptions}
                        value={topicFilter}
                        onChange={setTopicFilter}
                        placeholder="Filter by topic"
                      />
                    </div>
                  </div>

                  {/* Question List */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredQuestions.map((question) => {
                      const isSelected = selectedQuestions.some(q => q.id === question.id);
                      
                      return (
                        <div 
                          key={question.id}
                          className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => handleQuestionToggle(question)}
                        >
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleQuestionToggle(question)}
                              className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {question.title}
                                </h4>
                                <Badge variant={getDifficultyColor(question.difficulty)}>
                                  {question.difficulty}
                                </Badge>
                                <Badge variant="info">{question.language}</Badge>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {question.points} pts
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {question.description}
                              </p>
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Topic: {question.topic} • {question.testCases.length} test cases
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Questions Summary */}
            <div>
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sticky top-24">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Selected Questions ({selectedQuestions.length})
                    </h3>
                    {selectedQuestions.length > 0 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Eye}
                        onClick={() => setShowPreviewModal(true)}
                      >
                        Preview
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedQuestions.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">
                        No questions selected yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedQuestions.map((question, index) => (
                        <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                              Q{index + 1}: {question.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {question.difficulty} • {question.points} pts
                            </div>
                          </div>
                          <button
                            onClick={() => handleQuestionToggle(question)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Total Points: {selectedQuestions.reduce((sum, q) => sum + q.points, 0)}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* JSON Import Mode */}
        {creationMode === 'import' && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Import Assessment from JSON
                </h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowJsonHelpModal(true)}
                  >
                    View Format
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={Download}
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(sampleJsonFormat, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'sample-assessment.json';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download Sample
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessment JSON
                </label>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                  placeholder="Paste your assessment JSON here..."
                />
                
                {jsonError && (
                  <div className="mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-800 dark:text-red-200">JSON Validation Error</h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{jsonError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {jsonInput.length > 0 && `${jsonInput.length} characters`}
                  </div>
                  <Button 
                    onClick={handleJsonImport}
                    disabled={!jsonInput.trim()}
                    size="sm"
                  >
                    Parse JSON
                  </Button>
                </div>
              </div>

              {/* Imported Questions Preview */}
              {importedQuestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Imported Questions ({importedQuestions.length})
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {importedQuestions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded">
                              Q{index + 1}
                            </span>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {question.title}
                            </h5>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                            <Badge variant="info">{question.language}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {question.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Previous Assessments Mode */}
        {creationMode === 'previous' && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Copy from Previous Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Select a previous assessment to use as a template with performance insights
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPreviousAssessments.map((assessment) => (
                  <div 
                    key={assessment.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedPreviousAssessment === assessment.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handlePreviousAssessmentSelect(assessment.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        checked={selectedPreviousAssessment === assessment.id}
                        onChange={() => handlePreviousAssessmentSelect(assessment.id)}
                        className="mt-1 w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {assessment.title}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="font-medium">Questions:</span> {assessment.questions.length}
                          </div>
                          <div>
                            <span className="font-medium">Candidates:</span> {assessment.candidatesCount}
                          </div>
                          <div>
                            <span className="font-medium">Avg Score:</span> {assessment.averageScore}%
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {assessment.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedPreviousAssessment && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Assessment Preview
                  </h4>
                  <div className="space-y-2">
                    {mockPreviousAssessments.find(a => a.id === selectedPreviousAssessment)?.questions.map((question, index) => (
                      <div key={question.id} className="text-sm text-blue-800 dark:text-blue-200">
                        Q{index + 1}: {question.title} ({question.difficulty})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Generation Mode */}
        {creationMode === 'ai' && (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI-Generated Assessment
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Describe your requirements and let AI generate custom questions
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAiHelpModal(true)}
                >
                  Help & Examples
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessment Requirements Prompt
                </label>
                <Textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={4}
                  placeholder="Describe the type of assessment you want to create. For example: 'Create a React assessment focusing on hooks, state management, and component lifecycle. Include questions about useEffect, useState, and custom hooks. Target mid-level developers.'"
                />
              </div>

              {/* Difficulty Distribution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Question Difficulty Distribution
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Easy Questions</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={difficultySelection.easy}
                      onChange={(e) => setDifficultySelection(prev => ({ ...prev, easy: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Medium Questions</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={difficultySelection.medium}
                      onChange={(e) => setDifficultySelection(prev => ({ ...prev, medium: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Hard Questions</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={difficultySelection.hard}
                      onChange={(e) => setDifficultySelection(prev => ({ ...prev, hard: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Total Questions: {difficultySelection.easy + difficultySelection.medium + difficultySelection.hard}
                </div>
              </div>

              {aiError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-800 dark:text-red-200">Generation Error</h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">{aiError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {aiPrompt.length > 0 && `${aiPrompt.length} characters`}
                </div>
                <Button 
                  onClick={handleAiGeneration}
                  disabled={!aiPrompt.trim() || (difficultySelection.easy + difficultySelection.medium + difficultySelection.hard) === 0 || isGenerating}
                  loading={isGenerating}
                  icon={Wand2}
                >
                  {isGenerating ? 'Generating Questions...' : 'Generate Questions'}
                </Button>
              </div>

              {/* Generated Questions Preview */}
              {generatedQuestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Generated Questions ({generatedQuestions.length})
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {generatedQuestions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded">
                              Q{index + 1}
                            </span>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {question.title}
                            </h5>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                            <Badge variant="info">{question.language}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {question.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preview Modal */}
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title="Assessment Preview"
          size="xl"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {assessmentData.title || 'Untitled Assessment'}
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                {assessmentData.description || 'No description provided'}
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Duration:</span>
                  <span className="ml-2 font-medium">{assessmentData.duration} min</span>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Questions:</span>
                  <span className="ml-2 font-medium">{selectedQuestions.length}</span>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">Languages:</span>
                  <span className="ml-2 font-medium">{assessmentData.allowedLanguages.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedQuestions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded">
                      Q{index + 1}
                    </span>
                    <h4 className="font-medium text-gray-900 dark:text-white">{question.title}</h4>
                    <Badge variant={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="info">{question.language}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {question.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Points: {question.points} • Test Cases: {question.testCases.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>

        {/* AI Help Modal */}
        <Modal
          isOpen={showAiHelpModal}
          onClose={() => setShowAiHelpModal(false)}
          title="AI Generation Guide"
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                How to Write Effective Prompts
              </h4>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <strong>Be Specific:</strong> Include the technology stack, skill level, and specific topics you want to cover.
                </div>
                <div>
                  <strong>Mention Context:</strong> Specify if it's for junior, mid-level, or senior developers.
                </div>
                <div>
                  <strong>Include Focus Areas:</strong> List specific concepts, frameworks, or problem types.
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Example Prompts
              </h4>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Frontend Assessment</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "Create a React assessment for mid-level developers focusing on hooks (useState, useEffect, useContext), 
                    component lifecycle, state management, and performance optimization. Include practical scenarios 
                    like building reusable components and handling API calls."
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Backend Assessment</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "Generate Python backend questions for senior developers covering REST API design, 
                    database optimization, async programming, error handling, and security best practices. 
                    Focus on Django/Flask frameworks and PostgreSQL."
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Algorithm Assessment</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    "Create algorithm and data structure problems for junior developers. Include array manipulation, 
                    string processing, basic sorting algorithms, and simple tree/graph traversal problems. 
                    Focus on problem-solving approach rather than complex optimizations."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Tips for Better Results:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Specify the programming language(s) you want to focus on</li>
                <li>• Mention the target experience level (junior, mid, senior)</li>
                <li>• Include specific frameworks or libraries if relevant</li>
                <li>• Describe the type of role or project context</li>
                <li>• Set the difficulty distribution based on your needs</li>
              </ul>
            </div>
          </div>
        </Modal>

        {/* JSON Format Help Modal */}
        <Modal
          isOpen={showJsonHelpModal}
          onClose={() => setShowJsonHelpModal(false)}
          title="JSON Format Guide"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Use the following JSON structure to import assessments:
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                {JSON.stringify(sampleJsonFormat, null, 2)}
              </pre>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Required Fields:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• <code>title</code>: Assessment name</li>
                <li>• <code>questions</code>: Array of question objects</li>
                <li>• Each question needs: <code>title</code>, <code>description</code>, <code>difficulty</code>, <code>language</code></li>
              </ul>
            </div>
          </div>
        </Modal>

        <AssessmentPreview />
        <SendAssessmentModal />
      </div>
    );
};