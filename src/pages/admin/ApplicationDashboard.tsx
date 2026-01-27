import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { 
  Search,
  Filter,
  Calendar,
  Mail,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import { JobApplication, JobPost } from '../../types';

// Mock job data
const mockJobPosts: JobPost[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web technologies to join our team.',
    location: 'San Francisco, CA',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS'],
    experience: '2+ years',
    applicationDeadline: new Date('2025-02-15'),
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    status: 'published',
    publicLink: '/job/frontend-dev-2025'
  },
  {
    id: '2',
    title: 'Backend Engineer',
    description: 'Join our backend team to build scalable APIs and microservices using Python and Django.',
    location: 'Remote',
    requiredSkills: ['Python', 'Django', 'REST API', 'PostgreSQL'],
    experience: '3+ years',
    applicationDeadline: new Date('2025-02-28'),
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
    status: 'published',
    publicLink: '/job/backend-eng-2025'
  }
];

// Mock application data
const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobId: '1',
    candidateId: '101',
    candidateName: 'Alice Johnson',
    candidateEmail: 'alice@example.com',
    candidatePhone: '+1 (555) 123-4567',
    linkedinProfile: 'https://linkedin.com/in/alicejohnson',
    prescreeningAnswers: [
      {
        questionId: '1',
        questionText: 'How many years have you worked with React?',
        answer: '3 years'
      },
      {
        questionId: '2',
        questionText: 'Why are you interested in this role?',
        answer: 'I am passionate about frontend development and want to work with cutting-edge technologies.'
      }
    ],
    status: 'pending',
    appliedAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  {
    id: '2',
    jobId: '1',
    candidateId: '102',
    candidateName: 'Bob Smith',
    candidateEmail: 'bob@example.com',
    candidatePhone: '+1 (555) 987-6543',
    githubProfile: 'https://github.com/bobsmith',
    prescreeningAnswers: [
      {
        questionId: '1',
        questionText: 'How many years have you worked with React?',
        answer: '5 years'
      },
      {
        questionId: '2',
        questionText: 'Why are you interested in this role?',
        answer: 'I am looking for a challenging role where I can contribute to innovative projects.'
      }
    ],
    status: 'shortlisted',
    appliedAt: new Date('2025-01-16'),
    updatedAt: new Date('2025-01-18')
  },
  {
    id: '3',
    jobId: '2',
    candidateId: '103',
    candidateName: 'Carol Davis',
    candidateEmail: 'carol@example.com',
    candidatePhone: '+1 (555) 456-7890',
    linkedinProfile: 'https://linkedin.com/in/caroldavis',
    githubProfile: 'https://github.com/caroldavis',
    prescreeningAnswers: [
      {
        questionId: '1',
        questionText: 'How many years have you worked with Python?',
        answer: '4 years'
      },
      {
        questionId: '2',
        questionText: 'Why are you interested in this role?',
        answer: 'I enjoy building scalable backend systems and solving complex problems.'
      }
    ],
    status: 'rejected',
    appliedAt: new Date('2025-01-17'),
    updatedAt: new Date('2025-01-19')
  }
];

interface ApplicationDashboardProps {
  onNavigate: (view: string) => void;
}

export const ApplicationDashboard: React.FC<ApplicationDashboardProps> = ({ onNavigate }) => {
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState('');

  const filteredApplications = applications
    .filter(app => 
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(app => 
      statusFilter ? app.status === statusFilter : true
    )
    .filter(app => 
      selectedJob ? app.jobId === selectedJob : true
    );

  const getJobTitle = (jobId: string) => {
    const job = mockJobPosts.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return <Badge variant="success">Shortlisted</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'need_more_info':
        return <Badge variant="info">Need Info</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    const updatedApplications = applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: newStatus as any, updatedAt: new Date() } 
        : app
    );
    
    setApplications(updatedApplications);
  };

  const handleViewApplication = (applicationId: string) => {
    // In a real app, this would navigate to a detailed view
    console.log('View application:', applicationId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Application Dashboard</h1>
        <p className="text-gray-600">
          Review and manage job applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {applications.length}
            </div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {applications.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {applications.filter(a => a.status === 'shortlisted').length}
            </div>
            <div className="text-sm text-gray-600">Shortlisted</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {applications.filter(a => a.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="need_more_info">Need More Info</option>
              </select>
            </div>
            <div>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Jobs</option>
                {mockJobPosts.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
            <div>
              <Button variant="outline" icon={Filter} onClick={() => {}}>
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.candidateName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.candidateEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getJobTitle(application.jobId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {application.appliedAt.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {application.updatedAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={Eye}
                          onClick={() => handleViewApplication(application.id)}
                        >
                          <span className="sr-only">View</span>
                        </Button>
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusChange(application.id, e.target.value)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        >
                          <option value="pending">Pending</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                          <option value="need_more_info">Need Info</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};