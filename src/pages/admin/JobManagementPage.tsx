import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Send,
  CheckCircle,
  XCircle,
  Globe,
  X,
  Clock,
  AlertCircle
} from 'lucide-react';
import { jobApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'closed' | 'filled' | 'cancelled';
  workLocationType: 'remote' | 'onsite' | 'hybrid';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'temporary';
  requirements: {
    skills: string[];
    minExperience?: number;
    maxExperience?: number;
  };
  applicationsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  approvalStatus?: {
    status: 'pending' | 'approved' | 'rejected' | 'not_required';
    rejectionReason?: string;
  };
  createdBy: string;
}

export const JobManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Load jobs
  useEffect(() => {
    loadJobs();
  }, [statusFilter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await jobApi.getAll({
        status: statusFilter || undefined,
        limit: 50,
      });
      if (response.success) {
        setJobs(response.data);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      setActionLoading(jobId);
      const response = await jobApi.delete(jobId);
      if (response.success) {
        await loadJobs();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      alert(error.response?.data?.error?.message || 'Failed to delete job');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitForApproval = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      const response = await jobApi.submitForApproval(jobId);
      if (response.success) {
        await loadJobs();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      alert(error.response?.data?.error?.message || 'Failed to submit job for approval');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveJob = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      const response = await jobApi.approve(jobId);
      if (response.success) {
        await loadJobs();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      alert(error.response?.data?.error?.message || 'Failed to approve job');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectJob = async (jobId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason || reason.trim().length < 10) {
      alert('Rejection reason must be at least 10 characters');
      return;
    }

    try {
      setActionLoading(jobId);
      const response = await jobApi.reject(jobId, reason);
      if (response.success) {
        await loadJobs();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      alert(error.response?.data?.error?.message || 'Failed to reject job');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePublishJob = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      const response = await jobApi.publish(jobId);
      if (response.success) {
        await loadJobs();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      alert(error.response?.data?.error?.message || 'Failed to publish job');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to close this job? It will no longer accept applications.')) {
      return;
    }

    try {
      setActionLoading(jobId);
      const response = await jobApi.close(jobId);
      if (response.success) {
        await loadJobs();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      alert(error.response?.data?.error?.message || 'Failed to close job');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string, approvalStatus?: { status: string; rejectionReason?: string }) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'draft':
        return <Badge variant="warning">Draft</Badge>;
      case 'pending_approval':
        return <Badge variant="info">Pending Approval</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'closed':
        return <Badge variant="danger">Closed</Badge>;
      case 'filled':
        return <Badge variant="success">Filled</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const canEdit = (job: Job): boolean => {
    if (!user) return false;
    return job.createdBy === user.id || user.role === 'admin' || 
           (user.role === 'hiring-manager' /*&& job.status === 'pending_approval'*/);
  };

  const canDelete = (job: Job): boolean => {
    if (!user) return false;
    return (job.createdBy === user.id || user.role === 'admin') && 
           ['draft', 'cancelled'].includes(job.status);
  };

  const canSubmit = (job: Job): boolean => {
    if (!user) return false;
    return job.status === 'draft' && (job.createdBy === user.id || user.role === 'admin');
  };

  const canApprove = (job: Job): boolean => {
    if (!user) return false;
    return job.status === 'pending_approval' && ['hiring-manager', 'admin'].includes(user.role);
  };

  const canPublish = (job: Job): boolean => {
    if (!user) return false;
    return job.status === 'approved' && ['recruiter', 'admin'].includes(user.role);
  };

  const canClose = (job: Job): boolean => {
    if (!user) return false;
    return job.status === 'published' && 
           (job.createdBy === user.id || ['admin', 'hiring-manager'].includes(user.role));
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCreateJobPath = (): string => {
    if (user?.role === 'recruiter') {
      return '/recruiter/jobs/create';
    } else if (user?.role === 'admin') {
      return '/admin/jobs/create';
    }
    return '/recruiter/jobs/create';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage job postings
          </p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => navigate(getCreateJobPath())}
        >
          Create New Job
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search jobs..."
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
                className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
                <option value="filled">Filled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                onClick={loadJobs}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Applications
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Views
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredJobs.map((job) => (
                      <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{job.description.substring(0, 60)}...</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{job.location}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {job.workLocationType} • {job.employmentType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(job.status, job.approvalStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {job.applicationsCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {job.viewsCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-1">
                            {canEdit(job) && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                icon={Edit}
                                onClick={() => navigate(`/recruiter/jobs/edit/${job._id}`)}
                                title="Edit"
                              />
                            )}
                            {canSubmit(job) && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                icon={Send}
                                onClick={() => handleSubmitForApproval(job._id)}
                                loading={actionLoading === job._id}
                                title="Submit for Approval"
                              />
                            )}
                            {canApprove(job) && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  icon={CheckCircle}
                                  onClick={() => handleApproveJob(job._id)}
                                  loading={actionLoading === job._id}
                                  title="Approve"
                                />
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  icon={XCircle}
                                  onClick={() => handleRejectJob(job._id)}
                                  loading={actionLoading === job._id}
                                  title="Reject"
                                />
                              </>
                            )}
                            {canPublish(job) && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                icon={Globe}
                                onClick={() => handlePublishJob(job._id)}
                                loading={actionLoading === job._id}
                                title="Publish"
                              />
                            )}
                            {canClose(job) && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                icon={X}
                                onClick={() => handleCloseJob(job._id)}
                                loading={actionLoading === job._id}
                                title="Close"
                              />
                            )}
                            {canDelete(job) && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                icon={Trash2}
                                onClick={() => handleDeleteJob(job._id)}
                                loading={actionLoading === job._id}
                                title="Delete"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredJobs.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm || statusFilter 
                      ? 'Try adjusting your filters'
                      : 'Get started by creating a new job posting.'
                    }
                  </p>
                  {!searchTerm && !statusFilter && (
                    <Button icon={Plus} onClick={() => navigate(getCreateJobPath())}>
                      Create Job
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
