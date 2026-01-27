import { useState, useEffect } from 'react';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  status: 'invited' | 'in_progress' | 'completed' | 'not_started';
  invitedAt: Date;
  lastActivity?: Date;
  score?: number;
  assessmentId?: string;
}

interface UseCandidateManagementReturn {
  candidates: Candidate[];
  filteredCandidates: Candidate[];
  searchTerm: string;
  statusFilter: string;
  selectedCandidates: string[];
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  handleSelectCandidate: (candidateId: string) => void;
  handleSelectAll: () => void;
  handleDeleteCandidate: (candidateId: string) => void;
  handleEditCandidate: (candidate: Candidate) => void;
  handleAddCandidate: (candidate: Omit<Candidate, 'id' | 'invitedAt' | 'status'>) => void;
}

export const useCandidateManagement = (): UseCandidateManagementReturn => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  // Mock data initialization
  useEffect(() => {
    // In a real app, this would come from an API
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        position: 'Frontend Developer',
        status: 'completed',
        invitedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        score: 85,
        assessmentId: 'frontend-test-1'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        position: 'Backend Developer',
        status: 'in_progress',
        invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 30 * 60 * 1000),
        assessmentId: 'backend-test-1'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        position: 'Full Stack Developer',
        status: 'invited',
        invitedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        assessmentId: 'fullstack-test-1'
      }
    ];

    setCandidates(mockCandidates);
  }, []);

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const handleDeleteCandidate = (candidateId: string) => {
    setCandidates(prev => prev.filter(c => c.id !== candidateId));
  };

  const handleEditCandidate = (candidate: Candidate) => {
    // Logic to edit candidate would go here
    console.log('Edit candidate', candidate);
  };

  const handleAddCandidate = (candidate: Omit<Candidate, 'id' | 'invitedAt' | 'status'>) => {
    const newCandidate: Candidate = {
      id: Date.now().toString(),
      ...candidate,
      status: 'not_started',
      invitedAt: new Date()
    };
    
    setCandidates(prev => [...prev, newCandidate]);
  };

  return {
    candidates,
    filteredCandidates,
    searchTerm,
    statusFilter,
    selectedCandidates,
    setSearchTerm,
    setStatusFilter,
    handleSelectCandidate,
    handleSelectAll,
    handleDeleteCandidate,
    handleEditCandidate,
    handleAddCandidate
  };
};