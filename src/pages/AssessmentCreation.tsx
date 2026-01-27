import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Wand2,
  Settings,
  FileText,
  Clock,
  Code
} from 'lucide-react';

interface AssessmentCreationProps {
  onNavigate: (view: string) => void;
}

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  language: string;
  points: number;
  starterCode: string;
}

export const AssessmentCreation: React.FC<AssessmentCreationProps> = ({ onNavigate }) => {
  const [assessmentData, setAssessmentData] = useState({
    title: '',
    description: '',
    duration: 60,
    allowedLanguages: [] as string[],
    plagiarismDetection: true
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const handleLanguageToggle = (language: string) => {
    setAssessmentData(prev => ({
      ...prev,
      allowedLanguages: prev.allowedLanguages.includes(language)
        ? prev.allowedLanguages.filter(l => l !== language)
        : [...prev.allowedLanguages, language]
    }));
  };

  const handleSaveQuestion = (questionData: Partial<Question>) => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...questionData }
          : q
      ));
    } else {
      const newQuestion: Question = {
        id: Date.now().toString(),
        title: questionData.title || '',
        description: questionData.description || '',
        difficulty: questionData.difficulty || 'medium',
        language: questionData.language || 'javascript',
        points: questionData.points || 10,
        starterCode: questionData.starterCode || ''
      };
      setQuestions(prev => [...prev, newQuestion]);
    }
    
    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  const QuestionModal = () => {
    const [questionForm, setQuestionForm] = useState({
      title: editingQuestion?.title || '',
      description: editingQuestion?.description || '',
      difficulty: editingQuestion?.difficulty || 'medium',
      language: editingQuestion?.language || 'javascript',
      points: editingQuestion?.points || 10,
      starterCode: editingQuestion?.starterCode || ''
    });

    return (
      <Modal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title={editingQuestion ? 'Edit Question' : 'Add New Question'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Question Title"
            placeholder="e.g., Two Sum Problem"
            value={questionForm.title}
            onChange={(e) => setQuestionForm(prev => ({ ...prev, title: e.target.value }))}
          />
          
          <Textarea
            label="Description"
            placeholder="Describe the problem and requirements..."
            rows={4}
            value={questionForm.description}
            onChange={(e) => setQuestionForm(prev => ({ ...prev, description: e.target.value }))}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Difficulty"
              options={difficultyOptions}
              value={questionForm.difficulty}
              onChange={(value) => setQuestionForm(prev => ({ ...prev, difficulty: value }))}
            />
            
            <Select
              label="Language"
              options={languageOptions}
              value={questionForm.language}
              onChange={(value) => setQuestionForm(prev => ({ ...prev, language: value }))}
            />
          </div>
          
          <Input
            label="Points"
            type="number"
            value={questionForm.points}
            onChange={(e) => setQuestionForm(prev => ({ ...prev, points: parseInt(e.target.value) }))}
          />
          
          <Textarea
            label="Starter Code (Optional)"
            placeholder="function solution() {&#10;  // Your code here&#10;}"
            rows={6}
            value={questionForm.starterCode}
            onChange={(e) => setQuestionForm(prev => ({ ...prev, starterCode: e.target.value }))}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowQuestionModal(false)}>
              Cancel
            </Button>
            <Button icon={Save} onClick={() => handleSaveQuestion(questionForm)}>
              {editingQuestion ? 'Update' : 'Add'} Question
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Assessment</h1>
          <p className="text-gray-600">Build comprehensive coding tests for your candidates.</p>
        </div>
        <Button icon={Save} disabled={!assessmentData.title || questions.length === 0}>
          Save Assessment
        </Button>
      </div>

      {/* Assessment Details */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Assessment Details
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Allowed Programming Languages
            </label>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleLanguageToggle(lang.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    assessmentData.allowedLanguages.includes(lang.value)
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="plagiarism"
              checked={assessmentData.plagiarismDetection}
              onChange={(e) => setAssessmentData(prev => ({ ...prev, plagiarismDetection: e.target.checked }))}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="plagiarism" className="text-sm text-gray-700">
              Enable plagiarism detection and tab-switching alerts
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Questions ({questions.length})
            </h3>
            <div className="flex space-x-2">
              <Button variant="outline" icon={Wand2} size="sm">
                Generate with AI
              </Button>
              <Button icon={Plus} size="sm" onClick={() => setShowQuestionModal(true)}>
                Add Question
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h4>
              <p className="text-gray-600 mb-4">Start by adding your first coding question.</p>
              <Button icon={Plus} onClick={() => setShowQuestionModal(true)}>
                Add First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                          Q{index + 1}
                        </span>
                        <h4 className="font-semibold text-gray-900">{question.title}</h4>
                        <Badge variant={
                          question.difficulty === 'easy' ? 'success' :
                          question.difficulty === 'medium' ? 'warning' : 'danger'
                        }>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="info">{question.language}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{question.description}</p>
                      <div className="text-xs text-gray-500">
                        Points: {question.points}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={Edit}
                        onClick={() => {
                          setEditingQuestion(question);
                          setShowQuestionModal(true);
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon={Trash2}
                        onClick={() => setQuestions(prev => prev.filter(q => q.id !== question.id))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <QuestionModal />
    </div>
  );
};