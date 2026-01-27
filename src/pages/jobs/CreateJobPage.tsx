import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { jobApi, JobCreateData, jobsApiInstance } from '../../services/api';
import { jobService } from '../../services/api';
import { 
  Save, 
  Send, 
  ArrowLeft, 
  Plus, 
  X,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Award
} from 'lucide-react';

export const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'requirements' | 'compensation' | 'settings'>('basic');

  const [formData, setFormData] = useState<JobCreateData>({
    title: '',
    description: '',
    shortDescription: '',
    location: '',
    workLocationType: 'onsite',
    employmentType: 'full-time',
    requirements: {
      skills: [],
      visaSponsorship: false,
    },
    applicationSettings: {
      requireCoverLetter: false,
      requirePortfolio: false,
      requireReferences: false,
      assessmentRequired: true,
    },
    priority: 'medium',
  });

  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [educationInput, setEducationInput] = useState('');

  const handleChange = (field: string, value: string | number | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof JobCreateData] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          skills: [...(prev.requirements.skills || []), skillInput.trim()],
        },
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        skills: prev.requirements.skills.filter((_, i) => i !== index),
      },
    }));
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData(prev => ({
        ...prev,
        compensation: {
          ...prev.compensation,
          benefits: [...(prev.compensation?.benefits || []), benefitInput.trim()],
          currency: prev.compensation?.currency || 'USD',
          period: prev.compensation?.period || 'yearly',
        },
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      compensation: {
        ...prev.compensation,
        benefits: prev.compensation?.benefits?.filter((_, i) => i !== index) || [],
        currency: prev.compensation?.currency || 'USD',
        period: prev.compensation?.period || 'yearly',
      },
    }));
  };

  const addEducation = () => {
    if (educationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          education: [...(prev.requirements.education || []), educationInput.trim()],
        },
      }));
      setEducationInput('');
    }
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        education: prev.requirements.education?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 100) {
      newErrors.description = 'Description must be at least 100 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.requirements.skills || formData.requirements.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    if (formData.compensation) {
      if (formData.compensation.min && formData.compensation.max) {
        if (formData.compensation.max < formData.compensation.min) {
          newErrors.compensationMax = 'Max compensation must be greater than min';
        }
      }
    }

    if (formData.requirements.minExperience && formData.requirements.maxExperience) {
      if (formData.requirements.maxExperience < formData.requirements.minExperience) {
        newErrors.maxExperience = 'Max experience must be greater than min experience';
      }
    }

    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    console.log("save draft clicked");
    console.log("form data", validateForm());
    if (!validateForm()) {
      return;
    } 

    setIsSubmitting(true);
    try {
      console.log("payload being sent", formData);
      const response = await jobApi.create(formData);
      console.log("API response:", response);
      if (response.success) {
        navigate('/recruiter/job-management');
      }
    } catch (error: unknown) {

      const err = error as { response?: { data?: { error?: { details?: Array<{ field: string; message: string }> } } } };
      if (err.response?.data?.error?.details) {
        const validationErrors: Record<string, string> = {};
        err.response.data.error.details.forEach((detail) => {
          validationErrors[detail.field] = detail.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ submit: 'Failed to create job. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
/////
      const createResponse = await jobApi.create(formData);
      console.log('Create response:', createResponse);   // ← add this

      if (!createResponse.success) throw new Error('Creation failed');

      const jobId = createResponse.data._id || createResponse.data.id;
      console.log('Job ID received:', jobId);            // ← add this

      const submitResponse = await jobApi.submit(jobId);
      console.log('Submit response:', submitResponse);

//////

      const response = await jobApi.create(formData);
      if (response.success) {
        // Submit for approval
        await jobApi.submitForApproval(response.data._id);
        navigate('/recruiter/job-management');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: { details?: Array<{ field: string; message: string }> } } } };
      if (err.response?.data?.error?.details) {
        const validationErrors: Record<string, string> = {};
        err.response.data.error.details.forEach((detail) => {
          validationErrors[detail.field] = detail.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ submit: 'Failed to submit job. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'requirements', label: 'Requirements', icon: Award },
    { id: 'compensation', label: 'Compensation', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Users },
  ];



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Job Posting</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Fill in the details to create a new job posting</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Job Title *"
                placeholder="e.g., Senior Full Stack Developer"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
                icon={Briefcase}
              />

              <Textarea
                label="Short Description"
                placeholder="Brief summary for job board (max 500 characters)"
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                rows={3}
                error={errors.shortDescription}
              />

              <Textarea
                label="Full Description *"
                placeholder="Detailed job description (minimum 100 characters)"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={8}
                error={errors.description}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Location *"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  error={errors.location}
                  icon={MapPin}
                />

                <Select
                  label="Work Location Type *"
                  value={formData.workLocationType}
                  onChange={(value) => handleChange('workLocationType', value)}
                  options={[
                    { value: 'remote', label: 'Remote' },
                    { value: 'onsite', label: 'Onsite' },
                    { value: 'hybrid', label: 'Hybrid' },
                  ]}
                  error={errors.workLocationType}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Employment Type *"
                  value={formData.employmentType}
                  onChange={(value) => handleChange('employmentType', value)}
                  options={[
                    { value: 'full-time', label: 'Full Time' },
                    { value: 'part-time', label: 'Part Time' },
                    { value: 'contract', label: 'Contract' },
                    { value: 'internship', label: 'Internship' },
                    { value: 'temporary', label: 'Temporary' },
                  ]}
                  error={errors.employmentType}
                />

                <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(value) => handleChange('priority', value)}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Department"
                  placeholder="e.g., Engineering"
                  value={formData.department || ''}
                  onChange={(e) => handleChange('department', e.target.value)}
                />

                <Input
                  label="Team"
                  placeholder="e.g., Product Engineering"
                  value={formData.team || ''}
                  onChange={(e) => handleChange('team', e.target.value)}
                />

                <Input
                  label="Reporting To"
                  placeholder="e.g., Engineering Manager"
                  value={formData.reportingTo || ''}
                  onChange={(e) => handleChange('reportingTo', e.target.value)}
                />
              </div>

              <Input
                label="Application Deadline"
                type="datetime-local"
                value={formData.applicationDeadline || ''}
                onChange={(e) => handleChange('applicationDeadline', e.target.value)}
                icon={Calendar}
                error={errors.applicationDeadline}
              />
            </CardContent>
          </Card>
        )}

        {/* Requirements Tab */}
        {activeTab === 'requirements' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Requirements</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Required Skills *
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Enter a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSkill} icon={Plus}>
                    Add
                  </Button>
                </div>
                {errors.skills && (
                  <p className="text-sm text-red-600 mt-1">{errors.skills}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requirements.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Minimum Experience (years)"
                  type="number"
                  value={formData.requirements.minExperience || ''}
                  onChange={(e) => handleChange('requirements.minExperience', parseInt(e.target.value) || 0)}
                  error={errors.minExperience}
                />

                <Input
                  label="Maximum Experience (years)"
                  type="number"
                  value={formData.requirements.maxExperience || ''}
                  onChange={(e) => handleChange('requirements.maxExperience', parseInt(e.target.value) || 0)}
                  error={errors.maxExperience}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Education Requirements
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="e.g., Bachelor's Degree in Computer Science"
                    value={educationInput}
                    onChange={(e) => setEducationInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addEducation();
                      }
                    }}
                  />
                  <Button type="button" onClick={addEducation} icon={Plus}>
                    Add
                  </Button>
                </div>
                <div className="space-y-1">
                  {formData.requirements.education?.map((edu, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{edu}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="visaSponsorship"
                  checked={formData.requirements.visaSponsorship || false}
                  onChange={(e) => handleChange('requirements.visaSponsorship', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="visaSponsorship" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Visa sponsorship available
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compensation Tab */}
        {activeTab === 'compensation' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Compensation (Optional)</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Minimum Salary"
                  type="number"
                  value={formData.compensation?.min || ''}
                  onChange={(e) => handleChange('compensation.min', parseFloat(e.target.value) || 0)}
                  icon={DollarSign}
                  error={errors.compensationMin}
                />

                <Input
                  label="Maximum Salary"
                  type="number"
                  value={formData.compensation?.max || ''}
                  onChange={(e) => handleChange('compensation.max', parseFloat(e.target.value) || 0)}
                  icon={DollarSign}
                  error={errors.compensationMax}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Currency"
                  value={formData.compensation?.currency || 'USD'}
                  onChange={(value) => handleChange('compensation.currency', value)}
                  options={[
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'GBP', label: 'GBP (£)' },
                    { value: 'INR', label: 'INR (₹)' },
                  ]}
                />

                <Select
                  label="Period"
                  value={formData.compensation?.period || 'yearly'}
                  onChange={(value) => handleChange('compensation.period', value)}
                  options={[
                    { value: 'hourly', label: 'Hourly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'yearly', label: 'Yearly' },
                  ]}
                />
              </div>

              <Input
                label="Equity"
                placeholder="e.g., 0.1% - 0.5%"
                value={formData.compensation?.equity || ''}
                onChange={(e) => handleChange('compensation.equity', e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Benefits
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="e.g., Health Insurance"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <Button type="button" onClick={addBenefit} icon={Plus}>
                    Add
                  </Button>
                </div>
                <div className="space-y-1">
                  {formData.compensation?.benefits?.map((benefit, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{benefit}</span>
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Application Settings</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireCoverLetter"
                    checked={formData.applicationSettings.requireCoverLetter}
                    onChange={(e) => handleChange('applicationSettings.requireCoverLetter', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="requireCoverLetter" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Require cover letter
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requirePortfolio"
                    checked={formData.applicationSettings.requirePortfolio}
                    onChange={(e) => handleChange('applicationSettings.requirePortfolio', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="requirePortfolio" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Require portfolio
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireReferences"
                    checked={formData.applicationSettings.requireReferences}
                    onChange={(e) => handleChange('applicationSettings.requireReferences', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="requireReferences" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Require references
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="assessmentRequired"
                    checked={formData.applicationSettings.assessmentRequired}
                    onChange={(e) => handleChange('applicationSettings.assessmentRequired', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="assessmentRequired" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Assessment required
                  </label>
                </div>
              </div>

              <Input
                label="Maximum Applications"
                type="number"
                value={formData.applicationSettings.maxApplications || ''}
                onChange={(e) => handleChange('applicationSettings.maxApplications', parseInt(e.target.value) || undefined)}
                placeholder="Leave empty for unlimited"
              />

              <Input
                label="Auto-Reject Threshold (%)"
                type="number"
                min="0"
                max="100"
                value={formData.applicationSettings.autoRejectThreshold || ''}
                onChange={(e) => handleChange('applicationSettings.autoRejectThreshold', parseInt(e.target.value) || undefined)}
                placeholder="Auto-reject if score below this percentage"
              />

              <Textarea
                label="Internal Notes"
                placeholder="Internal notes (not visible to candidates)"
                value={formData.internalNotes || ''}
                onChange={(e) => handleChange('internalNotes', e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            icon={Save}
            onClick={handleSaveDraft}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            icon={Send}
            onClick={handleSubmitForApproval}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Submit for Approval
          </Button>
        </div>
      </form>
    </div>
  );
};

