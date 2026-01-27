import React from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { AssessmentCard } from '../../components/admin/AssessmentCard';
import { useAssessmentManagement } from '../../hooks/admin/useAssessmentManagement';
import { 
  Search,
  Plus
} from 'lucide-react';

interface AssessmentManagementViewProps {
  onNavigate: (view: string) => void;
}

export const AssessmentManagementView: React.FC<AssessmentManagementViewProps> = ({ onNavigate }) => {
  const {
    assessments,
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
  } = useAssessmentManagement();

  const sortOptions = [
    { value: 'date', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'candidates', label: 'Candidates' }
  ];

  const orderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col h-full">
      {/* Main Content - Optimized for space */}
      <main className="flex-1">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Assessment Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Create, edit, and manage your coding assessments
              </p>
            </div>
            <Button 
              icon={Plus}
              onClick={() => onNavigate('assessment-creation')}
              size="md"
            >
              Create Assessment
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search assessments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 py-2 text-sm"
                  />
                </div>
              </div>
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(value) => setSortBy(value as any)}
                placeholder="Sort by"
              />
              <Select
                options={orderOptions}
                value={sortOrder}
                onChange={(value) => setSortOrder(value as any)}
                placeholder="Order"
              />
            </div>
          </CardContent>
        </Card>

        {/* Assessments Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {assessments.map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                id={assessment.id}
                title={assessment.title}
                description={assessment.description}
                duration={assessment.duration}
                candidatesCount={assessment.candidatesCount}
                averageScore={assessment.averageScore}
                createdAt={assessment.createdAt}
                onEdit={handleEditAssessment}
                onDelete={handleDeleteAssessment}
                onDuplicate={handleDuplicateAssessment}
                onView={() => console.log('View assessment', assessment.id)}
              />
            ))}
          </div>
        )}

        {assessments.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No assessments</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new assessment.
            </p>
            <div className="mt-3">
              <Button icon={Plus} onClick={() => onNavigate('assessment-creation')} size="sm">
                Create Assessment
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};