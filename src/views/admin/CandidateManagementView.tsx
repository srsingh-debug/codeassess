import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { CandidateTableRow } from '../../components/admin/CandidateTableRow';
import { useCandidateManagement, Candidate } from '../../hooks/admin/useCandidateManagement';
import { 
  Search,
  Plus,
  Mail,
  Upload,
  Download
} from 'lucide-react';

interface CandidateManagementViewProps {
  onNavigate: (view: string) => void;
}

export const CandidateManagementView: React.FC<CandidateManagementViewProps> = ({ onNavigate }) => {
  const {
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
  } = useCandidateManagement();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    email: '',
    phone: '',
    position: ''
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'invited', label: 'Invited' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'not_started', label: 'Not Started' }
  ];

  const handleAddCandidateSubmit = () => {
    handleAddCandidate(newCandidate);
    setNewCandidate({ name: '', email: '', phone: '', position: '' });
    setShowAddModal(false);
  };

  const handleSendInvites = () => {
    // Logic to send invites would go here
    console.log('Sending invites to:', selectedCandidates);
    setShowInviteModal(false);
    // setSelectedCandidates([]); // This would be handled by the hook
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Content - Optimized for space */}
      <main className="flex-1">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Manage Candidates
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Invite, track, and manage candidates for your assessments
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                icon={Mail}
                onClick={() => setShowInviteModal(true)}
                disabled={selectedCandidates.length === 0}
                size="sm"
              >
                Send Invites
              </Button>
              <Button 
                icon={Plus}
                onClick={() => setShowAddModal(true)}
                size="sm"
              >
                Add Candidate
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-2 text-sm"
                />
              </div>
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
              />
              <div className="flex space-x-2">
                <Button variant="outline" icon={Upload} size="sm">
                  Import
                </Button>
                <Button variant="outline" icon={Download} size="sm">
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.length > 0 && selectedCandidates.length === filteredCandidates.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Invited
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCandidates.map((candidate) => (
                    <CandidateTableRow
                      key={candidate.id}
                      candidate={candidate}
                      isSelected={selectedCandidates.includes(candidate.id)}
                      onSelect={handleSelectCandidate}
                      onEdit={handleEditCandidate}
                      onDelete={handleDeleteCandidate}
                      onViewResults={() => console.log('View results for', candidate.id)}
                      onSendInvite={() => console.log('Send invite to', candidate.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No candidates</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding a new candidate.
            </p>
            <div className="mt-3">
              <Button icon={Plus} onClick={() => setShowAddModal(true)} size="sm">
                Add Candidate
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Add Candidate Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Candidate"
      >
        <div className="space-y-3">
          <Input
            label="Full Name"
            value={newCandidate.name}
            onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
            placeholder="Enter candidate's full name"
          />
          <Input
            label="Email"
            type="email"
            value={newCandidate.email}
            onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
            placeholder="Enter candidate's email"
          />
          <Input
            label="Phone"
            value={newCandidate.phone}
            onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})}
            placeholder="Enter candidate's phone number"
          />
          <Input
            label="Position"
            value={newCandidate.position}
            onChange={(e) => setNewCandidate({...newCandidate, position: e.target.value})}
            placeholder="Enter position applying for"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowAddModal(false)} size="sm">
            Cancel
          </Button>
          <Button onClick={handleAddCandidateSubmit} size="sm">
            Add Candidate
          </Button>
        </div>
      </Modal>

      {/* Send Invites Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Send Assessment Invites"
      >
        <div className="space-y-3">
          <p className="text-sm">
            You are about to send assessment invites to {selectedCandidates.length} candidate(s).
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Email Template</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Subject: Invitation to Complete Coding Assessment<br />
              Body: Dear candidate, you have been invited to complete a coding assessment...
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setShowInviteModal(false)} size="sm">
            Cancel
          </Button>
          <Button onClick={handleSendInvites} size="sm">
            Send Invites
          </Button>
        </div>
      </Modal>
    </div>
  );
};