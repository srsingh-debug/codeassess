import { useState, useEffect } from 'react';

interface Assessment {
  id: string;
  title: string;
  description: string;
  duration: number;
  candidatesCount: number;
  averageScore?: number;
  createdAt: Date;
}

export const useAssessmentManagement = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'candidates'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data initialization
  useEffect(() => {
    // In a real app, this would come from an API
    const mockAssessments: Assessment[] = [
      {
        id: '1',
        title: 'Frontend Developer Test - React Focus',
        description: 'Assessment for frontend developer positions focusing on React skills',
        duration: 90,
        candidatesCount: 25,
        averageScore: 78.5,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'Backend Developer Assessment - Python',
        description: 'Python-focused assessment for backend developer positions',
        duration: 120,
        candidatesCount: 18,
        averageScore: 82.3,
        createdAt: new Date('2024-01-10')
      },
      {
        id: '3',
        title: 'Full Stack Challenge',
        description: 'Comprehensive assessment covering both frontend and backend skills',
        duration: 180,
        candidatesCount: 45,
        averageScore: 76.2,
        createdAt: new Date('2024-01-05')
      }
    ];

    setAssessments(mockAssessments);
    setLoading(false);
  }, []);

  const filteredAndSortedAssessments = assessments
    .filter(assessment => 
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'candidates':
          comparison = a.candidatesCount - b.candidatesCount;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleCreateAssessment = () => {
    // Logic to create a new assessment
    console.log('Create assessment');
  };

  const handleEditAssessment = (id: string) => {
    // Logic to edit an assessment
    console.log('Edit assessment', id);
  };

  const handleDeleteAssessment = (id: string) => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  };

  const handleDuplicateAssessment = (id: string) => {
    // Logic to duplicate an assessment
    console.log('Duplicate assessment', id);
  };

  return {
    assessments: filteredAndSortedAssessments,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleCreateAssessment,
    handleEditAssessment,
    handleDeleteAssessment,
    handleDuplicateAssessment
  };
};